
package com.example.travelplanner.controller;

import com.example.travelplanner.entity.Flight;
import com.example.travelplanner.entity.Trip;
import com.example.travelplanner.repository.FlightRepository;
import com.example.travelplanner.repository.TripRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/flights")
@CrossOrigin(origins = "http://localhost:5173")
public class FlightController {

    private final FlightRepository flightRepository;
    private final TripRepository tripRepository;

    public FlightController(
            FlightRepository flightRepository,
            TripRepository tripRepository
    ) {
        this.flightRepository = flightRepository;
        this.tripRepository = tripRepository;
    }

    @GetMapping
    public ResponseEntity<List<Flight>> getFlights(
            @PathVariable Long tripId
    ) {
        if (!tripRepository.existsById(tripId)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                flightRepository
                        .findByTripIdOrderByDepartureTimeAsc(tripId)
        );
    }

    @PostMapping
    public ResponseEntity<Flight> createFlight(
            @PathVariable Long tripId,
            @RequestBody Flight flight
    ) {
        Trip trip = tripRepository.findById(tripId)
                .orElse(null);

        if (trip == null) {
            return ResponseEntity.notFound().build();
        }

        flight.setTrip(trip);

        return ResponseEntity.ok(
                flightRepository.save(flight)
        );
    }

    @PutMapping("/{flightId}")
    public ResponseEntity<Flight> updateFlight(
            @PathVariable Long tripId,
            @PathVariable Long flightId,
            @RequestBody Flight updatedFlight
    ) {
        Flight flight = flightRepository.findById(flightId)
                .orElse(null);

        if (flight == null
                || !flight.getTrip().getId().equals(tripId)) {
            return ResponseEntity.notFound().build();
        }

        flight.setSegment(updatedFlight.getSegment());
        flight.setAirline(updatedFlight.getAirline());
        flight.setFlightNumber(updatedFlight.getFlightNumber());
        flight.setDepartureAirport(updatedFlight.getDepartureAirport());
        flight.setArrivalAirport(updatedFlight.getArrivalAirport());
        flight.setDepartureTime(updatedFlight.getDepartureTime());
        flight.setArrivalTime(updatedFlight.getArrivalTime());
        flight.setBookingReference(updatedFlight.getBookingReference());
        flight.setBookingUrl(updatedFlight.getBookingUrl());
        flight.setNote(updatedFlight.getNote());

        return ResponseEntity.ok(
                flightRepository.save(flight)
        );
    }

    @DeleteMapping("/{flightId}")
    public ResponseEntity<Void> deleteFlight(
            @PathVariable Long tripId,
            @PathVariable Long flightId
    ) {
        Flight flight = flightRepository.findById(flightId)
                .orElse(null);

        if (flight == null
                || !flight.getTrip().getId().equals(tripId)) {
            return ResponseEntity.notFound().build();
        }

        flightRepository.delete(flight);

        return ResponseEntity.noContent().build();
    }
}
