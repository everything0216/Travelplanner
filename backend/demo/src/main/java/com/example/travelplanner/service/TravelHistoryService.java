package com.example.travelplanner.service;

import com.example.travelplanner.dto.TravelHistoryResponse;
import com.example.travelplanner.entity.Trip;
import com.example.travelplanner.entity.User;
import com.example.travelplanner.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
public class TravelHistoryService {

    private final TripRepository tripRepository;

    public TravelHistoryService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    public List<TravelHistoryResponse> getTravelHistory(User user) {

        List<Trip> trips = tripRepository.findAccessibleTrips(user);

        LocalDate today = LocalDate.now();

        return trips.stream()
                .map(trip -> {

                    String status;

                    if (trip.getStartDate() == null || trip.getEndDate() == null) {
                        status = "UPCOMING";
                    } else if (today.isBefore(trip.getStartDate())) {
                        status = "UPCOMING";
                    } else if (today.isAfter(trip.getEndDate())) {
                        status = "COMPLETED";
                    } else {
                        status = "ONGOING";
                    }

                    return new TravelHistoryResponse(
                            trip.getId(),
                            trip.getName(),
                            trip.getDestination(),
                            trip.getStartDate(),
                            trip.getEndDate(),
                            status
                    );
                })
                .sorted(
                        Comparator.comparing(
                                TravelHistoryResponse::getStartDate,
                                Comparator.nullsLast(Comparator.naturalOrder())
                        )
                )
                .toList();
    }
}