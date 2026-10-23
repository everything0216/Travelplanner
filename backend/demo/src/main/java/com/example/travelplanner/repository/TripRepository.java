package com.example.travelplanner.repository;

import com.example.travelplanner.entity.Trip;
import com.example.travelplanner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TripRepository extends JpaRepository<Trip, Long> {

    // 找出目前 User 是 Owner 或 TripMember 的所有旅行
    @Query("""
            SELECT DISTINCT t
            FROM Trip t
            LEFT JOIN t.members m
            WHERE t.owner = :user
               OR m.user = :user
            """)
    List<Trip> findAccessibleTrips(
            @Param("user") User user
    );

    // 查詢單一旅行
    // 只有 Owner 或 TripMember 可以取得
    @Query("""
            SELECT DISTINCT t
            FROM Trip t
            LEFT JOIN t.members m
            WHERE t.id = :tripId
              AND (t.owner = :user OR m.user = :user)
            """)
    Optional<Trip> findAccessibleTrip(
            @Param("tripId") Long tripId,
            @Param("user") User user
    );
}