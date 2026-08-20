package com.example.travelplanner.controller;

import com.example.travelplanner.dto.CreateExpenseRequest;
import com.example.travelplanner.entity.Expense;
import com.example.travelplanner.service.ExpenseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public Expense createExpense(
            @PathVariable Long tripId,
            @RequestBody CreateExpenseRequest request) {

        return expenseService.createExpense(
                tripId,
                request
        );
    }

    @GetMapping
    public List<Expense> getExpenses(
            @PathVariable Long tripId) {

        return expenseService.getExpensesByTripId(tripId);
    }
}