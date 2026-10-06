package org.example.smartexpensebackend.controller;

import org.example.smartexpensebackend.dto.GroupBalanceDTO;
import org.example.smartexpensebackend.entity.ExpenseSplit;
import org.example.smartexpensebackend.service.ExpenseSplitService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/splits")
@CrossOrigin(origins = "http://localhost:5173")
public class ExpenseSplitController {

    private final ExpenseSplitService splitService;

    public ExpenseSplitController(ExpenseSplitService splitService) {
        this.splitService = splitService;
    }
    @GetMapping("/group/{groupId}")
    public List<ExpenseSplit> getSplitsByGroup(
            @PathVariable Long groupId) {

        return splitService.getSplitsByGroup(groupId);
    }

    @PostMapping("/expense/{expenseId}")
    public List<ExpenseSplit> createEqualSplit(
            @PathVariable Long expenseId,
            @RequestBody List<Long> userIds) {

        return splitService.createEqualSplit(
                expenseId,
                userIds
        );
    }
    @GetMapping("/group/{groupId}/balances")
    public List<GroupBalanceDTO> calculateGroupBalances(
            @PathVariable Long groupId) {

        return splitService.calculateGroupBalances(groupId);
    }

    @GetMapping("/expense/{expenseId}")
    public List<ExpenseSplit> getSplitsByExpense(
            @PathVariable Long expenseId) {

        return splitService.getSplitsByExpense(expenseId);
    }

    @GetMapping("/user/{userId}")
    public List<ExpenseSplit> getSplitsByUser(
            @PathVariable Long userId) {

        return splitService.getSplitsByUser(userId);
    }
}