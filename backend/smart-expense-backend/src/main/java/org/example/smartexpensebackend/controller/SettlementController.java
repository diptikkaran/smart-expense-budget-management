package org.example.smartexpensebackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.smartexpensebackend.entity.Settlement;
import org.example.smartexpensebackend.service.SettlementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settlements")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class SettlementController {

    private final SettlementService settlementService;

    // Create settlement
    @PostMapping
    public Settlement createSettlement(
            @RequestParam Long groupId,
            @RequestParam Long payerId,
            @RequestParam Long receiverId,
            @RequestParam Double amount) {

        return settlementService.createSettlement(
                groupId,
                payerId,
                receiverId,
                amount
        );
    }

    // Get group settlements
    @GetMapping("/group/{groupId}")
    public List<Settlement> getGroupSettlements(
            @PathVariable Long groupId) {

        return settlementService.getGroupSettlements(groupId);
    }

    // Get settlements paid by user
    @GetMapping("/payer/{userId}")
    public List<Settlement> getSettlementsByPayer(
            @PathVariable Long userId) {

        return settlementService.getSettlementsByPayer(userId);
    }

    // Get settlements received by user
    @GetMapping("/receiver/{userId}")
    public List<Settlement> getSettlementsByReceiver(
            @PathVariable Long userId) {

        return settlementService.getSettlementsByReceiver(userId);
    }
}