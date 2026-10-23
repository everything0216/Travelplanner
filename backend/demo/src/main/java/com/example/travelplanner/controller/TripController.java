package com.example.travelplanner.controller;

import com.example.travelplanner.entity.Trip;
import com.example.travelplanner.service.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    // 查詢目前登入者可以看到的旅行
    @GetMapping
    public List<Trip> getMyTrips(Authentication authentication) {

        String email = authentication.getName();

        return tripService.getMyTrips(email);
    }

    // 查詢單一旅行
    // 只有 owner 或 member 可以看到
    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        return tripService.getAccessibleTrip(id, email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 新增旅行
    @PostMapping
    public ResponseEntity<Trip> createTrip(
            @RequestBody Trip trip,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                tripService.createTrip(trip, email)
        );
    }

    // 修改旅行
    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(
            @PathVariable Long id,
            @RequestBody Trip trip,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                tripService.updateTrip(id, trip, email)
        );
    }

    // 刪除旅行
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        tripService.deleteTrip(id, email);

        return ResponseEntity.noContent().build();
    }
}