
package com.example.travelplanner.controller;

import com.example.travelplanner.entity.User;
import com.example.travelplanner.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get current user's profile
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "nickname", user.getNickname(),
                        "bio", user.getBio() == null ? "" : user.getBio(),
                        "location", user.getLocation() == null ? "" : user.getLocation()
                )
        );
    }


    // Update current user's nickname
    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(
            Authentication authentication,
            @RequestBody Map<String, String> request
    ) {

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        String nickname = request.get("nickname");

        if (nickname == null || nickname.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Nickname cannot be empty")
            );
        }

        user.setNickname(nickname.trim());
        user.setBio(request.getOrDefault("bio", ""));
        user.setLocation(request.getOrDefault("location", ""));

        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(
                Map.of(
                        "id", updatedUser.getId(),
                        "email", updatedUser.getEmail(),
                        "nickname", updatedUser.getNickname(),
                        "bio", updatedUser.getBio() == null ? "" : updatedUser.getBio(),
                        "location", updatedUser.getLocation() == null ? "" : updatedUser.getLocation()
                )
        );
    }

}
