
package com.example.travelplanner.repository;

import com.example.travelplanner.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlightRepository
        extends JpaRepository<Flight, Long> {

    List<Flight> findByTripIdOrderByDepartureTimeAsc(
            Long tripId
    );
}
