package com.example.travelplanner.controller;

import com.example.travelplanner.entity.User;
import com.example.travelplanner.repository.UserRepository;
import com.example.travelplanner.service.JwtService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // =========================
    // Register
    // =========================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User user
    ) {

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body("Email is required");
        }

        if (user.getPassword() == null ||
                user.getPassword().isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body("Password is required");
        }

        if (user.getNickname() == null ||
                user.getNickname().isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body("Nickname is required");
        }

        if (userRepository.existsByEmail(user.getEmail())) {

            return ResponseEntity
                    .badRequest()
                    .body("Email already exists");
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        User savedUser =
                userRepository.save(user);

        savedUser.setPassword(null);

        return ResponseEntity.ok(savedUser);
    }


    // =========================
    // Login
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody User loginRequest
    ) {

        if (loginRequest.getEmail() == null ||
                loginRequest.getEmail().isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body("Email is required");
        }

        if (loginRequest.getPassword() == null ||
                loginRequest.getPassword().isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body("Password is required");
        }


        // 找使用者
        User user = userRepository
                .findByEmail(loginRequest.getEmail())
                .orElse(null);


        // Email 不存在
        if (user == null) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }


        // 檢查密碼
        boolean passwordMatches =
                passwordEncoder.matches(
                        loginRequest.getPassword(),
                        user.getPassword()
                );


        // 密碼錯誤
        if (!passwordMatches) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }


        // 登入成功，產生 JWT
        String token =
                jwtService.generateToken(
                        user.getEmail()
                );


        // 不回傳密碼
        user.setPassword(null);


        return ResponseEntity.ok(
                new LoginResponse(
                        token,
                        user.getId(),
                        user.getEmail(),
                        user.getNickname()
                )
        );
    }


    // Login response
    public record LoginResponse(
            String token,
            Long id,
            String email,
            String nickname
    ) {
    }
}