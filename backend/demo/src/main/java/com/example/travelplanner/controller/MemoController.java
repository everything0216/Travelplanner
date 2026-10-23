
package com.example.travelplanner.controller;

import com.example.travelplanner.entity.Memo;
import com.example.travelplanner.entity.Trip;
import com.example.travelplanner.repository.MemoRepository;
import com.example.travelplanner.repository.TripRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/memos")
@CrossOrigin(origins = "http://localhost:5173")
public class MemoController {

    private final MemoRepository memoRepository;
    private final TripRepository tripRepository;

    public MemoController(
            MemoRepository memoRepository,
            TripRepository tripRepository
    ) {
        this.memoRepository = memoRepository;
        this.tripRepository = tripRepository;
    }

    @GetMapping
    public ResponseEntity<List<Memo>> getMemos(
            @PathVariable Long tripId
    ) {
        if (!tripRepository.existsById(tripId)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                memoRepository.findByTripIdOrderByCreatedAtDesc(tripId)
        );
    }

    @PostMapping
    public ResponseEntity<Memo> createMemo(
            @PathVariable Long tripId,
            @RequestBody Memo memo
    ) {
        Trip trip = tripRepository.findById(tripId).orElse(null);

        if (trip == null) {
            return ResponseEntity.notFound().build();
        }

        memo.setTrip(trip);

        return ResponseEntity.ok(memoRepository.save(memo));
    }

    @PutMapping("/{memoId}")
    public ResponseEntity<Memo> updateMemo(
            @PathVariable Long tripId,
            @PathVariable Long memoId,
            @RequestBody Memo updatedMemo
    ) {
        Memo memo = memoRepository.findById(memoId).orElse(null);

        if (memo == null || !memo.getTrip().getId().equals(tripId)) {
            return ResponseEntity.notFound().build();
        }

        memo.setTitle(updatedMemo.getTitle());
        memo.setContent(updatedMemo.getContent());
        memo.setCompleted(updatedMemo.isCompleted());

        return ResponseEntity.ok(memoRepository.save(memo));
    }

    @DeleteMapping("/{memoId}")
    public ResponseEntity<Void> deleteMemo(
            @PathVariable Long tripId,
            @PathVariable Long memoId
    ) {
        Memo memo = memoRepository.findById(memoId).orElse(null);

        if (memo == null || !memo.getTrip().getId().equals(tripId)) {
            return ResponseEntity.notFound().build();
        }

        memoRepository.delete(memo);

        return ResponseEntity.noContent().build();
    }
}
