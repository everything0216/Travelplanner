package com.example.travelplanner.service;

import com.example.travelplanner.entity.Trip;
import com.example.travelplanner.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TripService {

    private final TripRepository tripRepository;

    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    // 查詢所有旅行
    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    // 查詢單一旅行
    public Optional<Trip> getTripById(Long id) {
        return tripRepository.findById(id);
    }

    // 新增旅行
    public Trip createTrip(Trip trip) {
        return tripRepository.save(trip);
    }

    // 修改旅行
    public Trip updateTrip(Long id, Trip trip) {

        Trip existingTrip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        existingTrip.setName(trip.getName());
        existingTrip.setDestination(trip.getDestination());
        existingTrip.setStartDate(trip.getStartDate());
        existingTrip.setEndDate(trip.getEndDate());
        existingTrip.setBudget(trip.getBudget());

        return tripRepository.save(existingTrip);
    }

    // 刪除旅行
    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }
}