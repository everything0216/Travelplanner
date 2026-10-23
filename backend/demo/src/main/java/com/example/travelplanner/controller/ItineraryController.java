package com.example.travelplanner.controller;

import com.example.travelplanner.entity.Itinerary;
import com.example.travelplanner.entity.Trip;
import com.example.travelplanner.repository.ItineraryRepository;
import com.example.travelplanner.repository.TripRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/itineraries")
@CrossOrigin(origins = "http://localhost:5173")
public class ItineraryController {

    private final ItineraryRepository itineraryRepository;
    private final TripRepository tripRepository;

    public ItineraryController(
            ItineraryRepository itineraryRepository,
            TripRepository tripRepository
    ) {
        this.itineraryRepository = itineraryRepository;
        this.tripRepository = tripRepository;
    }

    // 取得某個 Trip 的所有行程
    @GetMapping
    public ResponseEntity<List<Itinerary>> getItineraries(
            @PathVariable Long tripId
    ) {

        if (!tripRepository.existsById(tripId)) {
            return ResponseEntity.notFound().build();
        }

        List<Itinerary> itineraries =
                itineraryRepository.findByTripIdOrderByDateAscTimeAsc(tripId);

        return ResponseEntity.ok(itineraries);
    }

    // 新增行程
    @PostMapping
    public ResponseEntity<Itinerary> createItinerary(
            @PathVariable Long tripId,
            @RequestBody Itinerary itinerary
    ) {

        Trip trip = tripRepository.findById(tripId)
                .orElse(null);

        if (trip == null) {
            return ResponseEntity.notFound().build();
        }

        itinerary.setTrip(trip);

        Itinerary savedItinerary =
                itineraryRepository.save(itinerary);

        return ResponseEntity.ok(savedItinerary);
    }

    // 刪除行程
    @DeleteMapping("/{itineraryId}")
    public ResponseEntity<Void> deleteItinerary(
            @PathVariable Long tripId,
            @PathVariable Long itineraryId
    ) {

        Itinerary itinerary =
                itineraryRepository.findById(itineraryId)
                        .orElse(null);

        if (itinerary == null) {
            return ResponseEntity.notFound().build();
        }

        // 確認這個行程真的屬於這個 Trip
        if (!itinerary.getTrip().getId().equals(tripId)) {
            return ResponseEntity.notFound().build();
        }

        itineraryRepository.delete(itinerary);

        return ResponseEntity.noContent().build();
    }

    // 修改行程
    @PutMapping("/{itineraryId}")
    public ResponseEntity<Itinerary> updateItinerary(
            @PathVariable Long tripId,
            @PathVariable Long itineraryId,
            @RequestBody Itinerary updatedItinerary
    ) {

        Itinerary itinerary =
                itineraryRepository.findById(itineraryId)
                        .orElse(null);

        if (itinerary == null) {
            return ResponseEntity.notFound().build();
        }

        // 確認這個行程屬於這個 Trip
        if (!itinerary.getTrip().getId().equals(tripId)) {
            return ResponseEntity.notFound().build();
        }

        itinerary.setDate(updatedItinerary.getDate());
        itinerary.setTime(updatedItinerary.getTime());
        itinerary.setLocation(updatedItinerary.getLocation());
        itinerary.setGoogleMapsUrl(updatedItinerary.getGoogleMapsUrl());
        itinerary.setNote(updatedItinerary.getNote());
        itinerary.setCost(updatedItinerary.getCost());

        Itinerary savedItinerary =
                itineraryRepository.save(itinerary);

        return ResponseEntity.ok(savedItinerary);
    }
}