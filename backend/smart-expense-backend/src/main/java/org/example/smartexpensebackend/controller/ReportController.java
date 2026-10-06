package org.example.smartexpensebackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.smartexpensebackend.dto.ReportDTO;
import org.example.smartexpensebackend.service.ReportService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/user/{userId}")
    public ReportDTO getUserReport(
            @PathVariable Long userId) {

        return reportService.getUserReport(userId);
    }
}