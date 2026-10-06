package org.example.smartexpensebackend.service;

import lombok.RequiredArgsConstructor;
import org.example.smartexpensebackend.dto.GroupBalanceDTO;
import org.example.smartexpensebackend.entity.Expense;
import org.example.smartexpensebackend.entity.ExpenseGroup;
import org.example.smartexpensebackend.entity.ExpenseSplit;
import org.example.smartexpensebackend.entity.Settlement;
import org.example.smartexpensebackend.entity.User;
import org.example.smartexpensebackend.repository.ExpenseRepository;
import org.example.smartexpensebackend.repository.ExpenseSplitRepository;
import org.example.smartexpensebackend.repository.SettlementRepository;
import org.example.smartexpensebackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExpenseSplitService {

    private final ExpenseSplitRepository splitRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final SettlementRepository settlementRepository;

    public List<ExpenseSplit> createEqualSplit(
            Long expenseId,
            List<Long> userIds) {

        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() ->
                        new RuntimeException("Expense not found"));

        if (userIds == null || userIds.isEmpty()) {
            throw new RuntimeException("At least one user is required");
        }

        double shareAmount =
                expense.getAmount() / userIds.size();

        List<ExpenseSplit> splits = new ArrayList<>();

        for (Long userId : userIds) {

            User user = userRepository.findById(userId)
                    .orElseThrow(() ->
                            new RuntimeException("User not found"));

            ExpenseSplit split =
                    new ExpenseSplit(
                            expense,
                            user,
                            shareAmount
                    );

            splits.add(split);
        }

        return splitRepository.saveAll(splits);
    }

    public List<ExpenseSplit> getSplitsByExpense(Long expenseId) {
        return splitRepository.findByExpenseId(expenseId);
    }

    public List<ExpenseSplit> getSplitsByUser(Long userId) {
        return splitRepository.findByUserId(userId);
    }

    public List<ExpenseSplit> getSplitsByGroup(Long groupId) {

        List<Expense> expenses = expenseRepository.findAll()
                .stream()
                .filter(expense ->
                        expense.getGroup() != null &&
                                expense.getGroup().getId().equals(groupId))
                .toList();

        List<ExpenseSplit> result = new ArrayList<>();

        for (Expense expense : expenses) {
            result.addAll(
                    splitRepository.findByExpenseId(expense.getId())
            );
        }

        return result;
    }

    public List<GroupBalanceDTO> calculateGroupBalances(
            Long groupId) {

        List<Expense> expenses = expenseRepository.findAll()
                .stream()
                .filter(expense ->
                        expense.getGroup() != null &&
                                expense.getGroup().getId().equals(groupId))
                .toList();

        Map<Long, GroupBalanceDTO> balanceMap =
                new HashMap<>();

        // 1. Calculate paid and owed amounts
        for (Expense expense : expenses) {

            User payer = expense.getUser();

            if (payer != null) {

                GroupBalanceDTO payerBalance =
                        balanceMap.computeIfAbsent(
                                payer.getId(),
                                id -> new GroupBalanceDTO(
                                        payer.getId(),
                                        payer.getName(),
                                        0.0,
                                        0.0,
                                        0.0
                                )
                        );

                payerBalance.setTotalPaid(
                        payerBalance.getTotalPaid()
                                + expense.getAmount()
                );
            }

            List<ExpenseSplit> splits =
                    splitRepository.findByExpenseId(
                            expense.getId()
                    );

            for (ExpenseSplit split : splits) {

                User user = split.getUser();

                GroupBalanceDTO userBalance =
                        balanceMap.computeIfAbsent(
                                user.getId(),
                                id -> new GroupBalanceDTO(
                                        user.getId(),
                                        user.getName(),
                                        0.0,
                                        0.0,
                                        0.0
                                )
                        );

                userBalance.setTotalOwed(
                        userBalance.getTotalOwed()
                                + split.getShareAmount()
                );
            }
        }

        // 2. Base balance = paid - owed
        for (GroupBalanceDTO balance :
                balanceMap.values()) {

            balance.setBalance(
                    balance.getTotalPaid()
                            - balance.getTotalOwed()
            );
        }

        // 3. Apply settlements
        List<Settlement> settlements =
                settlementRepository.findByGroupId(groupId);

        for (Settlement settlement : settlements) {

            User payer = settlement.getPayer();
            User receiver = settlement.getReceiver();
            double amount = settlement.getAmount();

            GroupBalanceDTO payerBalance =
                    balanceMap.computeIfAbsent(
                            payer.getId(),
                            id -> new GroupBalanceDTO(
                                    payer.getId(),
                                    payer.getName(),
                                    0.0,
                                    0.0,
                                    0.0
                            )
                    );

            GroupBalanceDTO receiverBalance =
                    balanceMap.computeIfAbsent(
                            receiver.getId(),
                            id -> new GroupBalanceDTO(
                                    receiver.getId(),
                                    receiver.getName(),
                                    0.0,
                                    0.0,
                                    0.0
                            )
                    );

            payerBalance.setBalance(
                    payerBalance.getBalance() - amount
            );

            receiverBalance.setBalance(
                    receiverBalance.getBalance() + amount
            );
        }

        return new ArrayList<>(balanceMap.values());
    }
}