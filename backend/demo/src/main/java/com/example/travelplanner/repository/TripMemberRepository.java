package com.example.travelplanner.repository;

import com.example.travelplanner.entity.TripMember;
import com.example.travelplanner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TripMemberRepository
        extends JpaRepository<TripMember, Long> {

    List<TripMember> findByTripId(Long tripId);

    // 找某個 User 是否已經加入這個 Trip
    Optional<TripMember> findByTripIdAndUser(
            Long tripId,
            User user
    );
}