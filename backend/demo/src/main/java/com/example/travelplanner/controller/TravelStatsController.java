package com.example.travelplanner.controller;

import com.example.travelplanner.dto.TravelStatsResponse;
import com.example.travelplanner.entity.User;
import com.example.travelplanner.repository.UserRepository;
import com.example.travelplanner.service.TravelStatsService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/users/me")
public class TravelStatsController {

    private final TravelStatsService travelStatsService;
    private final UserRepository userRepository;

    public TravelStatsController(
            TravelStatsService travelStatsService,
            UserRepository userRepository
    ) {
        this.travelStatsService = travelStatsService;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public TravelStatsResponse getTravelStats(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        return travelStatsService.getTravelStats(user);
    }
}