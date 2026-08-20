package com.example.travelplanner.repository;

import com.example.travelplanner.entity.ExpenseParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseParticipantRepository
        extends JpaRepository<ExpenseParticipant, Long> {

    List<ExpenseParticipant> findByExpenseTripId(Long tripId);
}