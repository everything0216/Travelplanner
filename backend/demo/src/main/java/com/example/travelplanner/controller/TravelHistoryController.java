package com.example.travelplanner.controller;

import com.example.travelplanner.dto.TravelHistoryResponse;
import com.example.travelplanner.entity.User;
import com.example.travelplanner.repository.UserRepository;
import com.example.travelplanner.service.TravelHistoryService;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/users/me")
@CrossOrigin(origins = "http://localhost:5173")
public class TravelHistoryController {

    private final TravelHistoryService travelHistoryService;
    private final UserRepository userRepository;

    public TravelHistoryController(
            TravelHistoryService travelHistoryService,
            UserRepository userRepository
    ) {
        this.travelHistoryService = travelHistoryService;
        this.userRepository = userRepository;
    }

    @GetMapping("/history")
    public List<TravelHistoryResponse> getTravelHistory(
            Authentication authentication
    ) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        return travelHistoryService.getTravelHistory(user);
    }
}