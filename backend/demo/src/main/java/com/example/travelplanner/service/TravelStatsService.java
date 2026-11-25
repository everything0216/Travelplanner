package com.example.travelplanner.service;

import com.example.travelplanner.dto.TravelStatsResponse;
import com.example.travelplanner.entity.Expense;
import com.example.travelplanner.entity.Trip;
import com.example.travelplanner.entity.User;
import com.example.travelplanner.repository.ExpenseRepository;
import com.example.travelplanner.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class TravelStatsService {

    private final TripRepository tripRepository;
    private final ExpenseRepository expenseRepository;

    public TravelStatsService(
            TripRepository tripRepository,
            ExpenseRepository expenseRepository
    ) {
        this.tripRepository = tripRepository;
        this.expenseRepository = expenseRepository;
    }

    public TravelStatsResponse getTravelStats(User user) {

        // 取得使用者建立或參與的所有旅程
        List<Trip> trips = tripRepository.findAccessibleTrips(user);

        // 1. 旅程總數
        long totalTrips = trips.size();

        // 2. 不重複的目的地數量
        Set<String> destinations = new HashSet<>();

        // 3. 旅行總天數
        long travelDays = 0;

        // 4. 旅程總支出
        double totalExpenses = 0;

        for (Trip trip : trips) {

            // 計算目的地
            if (trip.getDestination() != null
                    && !trip.getDestination().isBlank()) {
                destinations.add(
                        trip.getDestination().trim().toLowerCase()
                );
            }

            // 計算旅行天數（包含開始日與結束日）
            if (trip.getStartDate() != null
                    && trip.getEndDate() != null
                    && !trip.getEndDate().isBefore(trip.getStartDate())) {

                travelDays += ChronoUnit.DAYS.between(
                        trip.getStartDate(),
                        trip.getEndDate()
                ) + 1;
            }

            // 計算這趟旅程的所有支出
            List<Expense> expenses =
                    expenseRepository.findByTripId(trip.getId());

            for (Expense expense : expenses) {
                if (expense.getAmount() != null) {
                    totalExpenses += expense.getAmount();
                }
            }
        }

        return new TravelStatsResponse(
                totalTrips,
                destinations.size(),
                travelDays,
                totalExpenses
        );
    }
}