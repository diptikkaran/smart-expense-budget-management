package org.example.smartexpensebackend.service;

import lombok.RequiredArgsConstructor;
import org.example.smartexpensebackend.entity.ExpenseGroup;
import org.example.smartexpensebackend.entity.Settlement;
import org.example.smartexpensebackend.entity.User;
import org.example.smartexpensebackend.repository.ExpenseGroupRepository;
import org.example.smartexpensebackend.repository.SettlementRepository;
import org.example.smartexpensebackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SettlementService {

    private final SettlementRepository settlementRepository;
    private final ExpenseGroupRepository groupRepository;
    private final UserRepository userRepository;

    // Create settlement
    public Settlement createSettlement(
            Long groupId,
            Long payerId,
            Long receiverId,
            Double amount) {

        ExpenseGroup group = groupRepository.findById(groupId)
                .orElseThrow(() ->
                        new RuntimeException("Group not found"));

        User payer = userRepository.findById(payerId)
                .orElseThrow(() ->
                        new RuntimeException("Payer not found"));

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() ->
                        new RuntimeException("Receiver not found"));

        Settlement settlement = new Settlement();

        settlement.setGroup(group);
        settlement.setPayer(payer);
        settlement.setReceiver(receiver);
        settlement.setAmount(amount);
        settlement.setDate(LocalDateTime.now());

        return settlementRepository.save(settlement);
    }

    // Get all settlements of a group
    public List<Settlement> getGroupSettlements(Long groupId) {
        return settlementRepository.findByGroupId(groupId);
    }

    // Get settlements paid by a user
    public List<Settlement> getSettlementsByPayer(Long userId) {
        return settlementRepository.findByPayerId(userId);
    }

    // Get settlements received by a user
    public List<Settlement> getSettlementsByReceiver(Long userId) {
        return settlementRepository.findByReceiverId(userId);
    }
}