package com.example.travelplanner.service;

import com.example.travelplanner.entity.Trip;
import com.example.travelplanner.entity.TripMember;
import com.example.travelplanner.entity.User;
import com.example.travelplanner.repository.TripRepository;
import com.example.travelplanner.repository.TripMemberRepository;
import com.example.travelplanner.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final TripMemberRepository tripMemberRepository;
    private final UserRepository userRepository;

    public TripService(
            TripRepository tripRepository,
            TripMemberRepository tripMemberRepository,
            UserRepository userRepository
    ) {
        this.tripRepository = tripRepository;
        this.tripMemberRepository = tripMemberRepository;
        this.userRepository = userRepository;
    }

    // 查詢目前登入者可以看到的旅行
    public List<Trip> getMyTrips(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return tripRepository.findAccessibleTrips(user);
    }

    // 查詢單一旅行
    // 只有 Owner 或 TripMember 可以看到
    public Optional<Trip> getAccessibleTrip(
            Long id,
            String email
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return tripRepository.findAccessibleTrip(id, user);
    }

    // 新增旅行
    public Trip createTrip(
            Trip trip,
            String email
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 建立者就是 Owner
        trip.setOwner(user);

        // 建立旅行
        Trip savedTrip = tripRepository.save(trip);

        // 建立者自動加入 TripMember
        TripMember ownerMember = new TripMember();

        ownerMember.setName(user.getNickname());
        ownerMember.setEmail(user.getEmail());
        ownerMember.setUser(user);
        ownerMember.setTrip(savedTrip);

        tripMemberRepository.save(ownerMember);

        return savedTrip;
    }

    // 修改旅行
    public Trip updateTrip(
            Long id,
            Trip trip,
            String email
    ) {

        Trip existingTrip = tripRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Trip not found")
                );

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // 目前先設定只有 Owner 可以修改
        if (!existingTrip.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("You are not the owner of this trip");
        }

        existingTrip.setName(trip.getName());
        existingTrip.setDestination(trip.getDestination());
        existingTrip.setStartDate(trip.getStartDate());
        existingTrip.setEndDate(trip.getEndDate());
        existingTrip.setBudget(trip.getBudget());

        return tripRepository.save(existingTrip);
    }

    // 刪除旅行
    public void deleteTrip(
            Long id,
            String email
    ) {

        Trip existingTrip = tripRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Trip not found")
                );

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // 只有 Owner 可以刪除
        if (!existingTrip.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("You are not the owner of this trip");
        }

        tripRepository.delete(existingTrip);
    }
}