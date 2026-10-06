package org.example.smartexpensebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportDTO {

    private Double totalIncome;

    private Double totalExpense;

    private Double balance;

    private Map<String, Double> categoryWiseExpense;

    private Map<String, Double> monthlyExpense;
}