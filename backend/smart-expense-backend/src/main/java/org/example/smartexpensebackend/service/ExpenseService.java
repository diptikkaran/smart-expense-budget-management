package org.example.smartexpensebackend.service;

import org.example.smartexpensebackend.entity.Expense;
import org.example.smartexpensebackend.entity.ExpenseGroup;
import org.example.smartexpensebackend.repository.ExpenseGroupRepository;
import org.example.smartexpensebackend.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseGroupRepository expenseGroupRepository;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            ExpenseGroupRepository expenseGroupRepository) {

        this.expenseRepository = expenseRepository;
        this.expenseGroupRepository = expenseGroupRepository;
    }

    // Create normal/personal expense
    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    // Create group expense
    public Expense createGroupExpense(
            Expense expense,
            Long groupId) {

        ExpenseGroup group = expenseGroupRepository.findById(groupId)
                .orElseThrow(() ->
                        new RuntimeException("Group not found"));

        expense.setGroup(group);

        return expenseRepository.save(expense);
    }

    // Get all expenses
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    // Get expenses by user
    public List<Expense> getExpensesByUser(Long userId) {
        return expenseRepository.findByUserId(userId);
    }

    // Delete expense
    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}