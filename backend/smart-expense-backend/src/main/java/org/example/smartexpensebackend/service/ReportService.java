package org.example.smartexpensebackend.service;

import lombok.RequiredArgsConstructor;
import org.example.smartexpensebackend.dto.ReportDTO;
import org.example.smartexpensebackend.entity.Expense;
import org.example.smartexpensebackend.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ExpenseRepository expenseRepository;

    public ReportDTO getUserReport(Long userId) {

        List<Expense> expenses =
                expenseRepository.findByUserId(userId);

        double totalIncome = 0;
        double totalExpense = 0;

        Map<String, Double> categoryWiseExpense =
                new LinkedHashMap<>();

        Map<String, Double> monthlyExpense =
                new LinkedHashMap<>();

        DateTimeFormatter monthFormatter =
                DateTimeFormatter.ofPattern("MMMM");

        for (Expense expense : expenses) {

            if ("INCOME".equalsIgnoreCase(expense.getType())) {

                totalIncome += expense.getAmount();

            } else if ("EXPENSE".equalsIgnoreCase(expense.getType())) {

                totalExpense += expense.getAmount();

                // Category-wise
                categoryWiseExpense.merge(
                        expense.getCategory(),
                        expense.getAmount(),
                        Double::sum
                );

                // Monthly
                if (expense.getDate() != null) {

                    String month =
                            expense.getDate()
                                    .format(monthFormatter);

                    monthlyExpense.merge(
                            month,
                            expense.getAmount(),
                            Double::sum
                    );
                }
            }
        }

        double balance = totalIncome - totalExpense;

        return new ReportDTO(
                totalIncome,
                totalExpense,
                balance,
                categoryWiseExpense,
                monthlyExpense
        );
    }
}