
package com.example.travelplanner.repository;

import com.example.travelplanner.entity.Memo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemoRepository extends JpaRepository<Memo, Long> {

    List<Memo> findByTripIdOrderByCreatedAtDesc(Long tripId);
}
