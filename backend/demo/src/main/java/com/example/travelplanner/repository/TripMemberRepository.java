package com.example.travelplanner.repository;

import com.example.travelplanner.entity.TripMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripMemberRepository extends JpaRepository<TripMember, Long> {
    List<TripMember> findByTripId(Long tripId);
}