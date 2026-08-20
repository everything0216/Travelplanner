package com.example.travelplanner.controller;

import com.example.travelplanner.dto.BalanceResponse;
import com.example.travelplanner.dto.SettlementResponse;
import com.example.travelplanner.service.SettlementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/settlement")
public class SettlementController {

    private final SettlementService settlementService;

    public SettlementController(
            SettlementService settlementService) {

        this.settlementService = settlementService;
    }

    @GetMapping("/balances")
    public List<BalanceResponse> getBalances(
            @PathVariable Long tripId) {

        return settlementService.calculateBalances(tripId);
    }

    @GetMapping
    public List<SettlementResponse> getSettlements(
            @PathVariable Long tripId) {

        return settlementService.calculateSettlements(tripId);
    }
}