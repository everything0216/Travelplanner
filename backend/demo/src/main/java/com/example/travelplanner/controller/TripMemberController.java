package com.example.travelplanner.controller;

import com.example.travelplanner.entity.TripMember;
import com.example.travelplanner.service.TripMemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/members")
public class TripMemberController {

    private final TripMemberService tripMemberService;

    public TripMemberController(TripMemberService tripMemberService) {
        this.tripMemberService = tripMemberService;
    }

    @PostMapping
    public TripMember addMember(
            @PathVariable Long tripId,
            @RequestBody TripMember member) {

        return tripMemberService.addMember(tripId, member);
    }

    @GetMapping
    public List<TripMember> getMembers(
            @PathVariable Long tripId) {

        return tripMemberService.getMembersByTripId(tripId);
    }

    @PutMapping("/{memberId}")
    public TripMember updateMember(
            @PathVariable Long memberId,
            @RequestBody TripMember member) {

        return tripMemberService.updateMember(memberId, member);
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<Void> deleteMember(
            @PathVariable Long memberId) {

        tripMemberService.deleteMember(memberId);

        return ResponseEntity.noContent().build();
    }
}