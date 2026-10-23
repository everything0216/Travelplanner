package com.example.travelplanner.repository;

import com.example.travelplanner.entity.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {

    List<Itinerary> findByTripIdOrderByDateAscTimeAsc(Long tripId);
}