package com.example.travelplanner.repository;

import com.example.travelplanner.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByTripId(Long tripId);
}