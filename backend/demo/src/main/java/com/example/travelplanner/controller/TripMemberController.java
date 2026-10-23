package com.example.travelplanner.controller;

import com.example.travelplanner.entity.TripMember;
import com.example.travelplanner.service.TripMemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/members")
public class TripMemberController {

    private final TripMemberService tripMemberService;

    public TripMemberController(TripMemberService tripMemberService) {
        this.tripMemberService = tripMemberService;
    }

    // 新增成員
    @PostMapping
    public TripMember addMember(
            @PathVariable Long tripId,
            @RequestBody TripMember member,
            Authentication authentication) {

        String email = authentication.getName();

        return tripMemberService.addMember(
                tripId,
                member,
                email
        );
    }

    // 查詢成員
    @GetMapping
    public List<TripMember> getMembers(
            @PathVariable Long tripId,
            Authentication authentication) {

        String email = authentication.getName();

        return tripMemberService.getMembersByTripId(
                tripId,
                email
        );
    }

    // 修改成員
    @PutMapping("/{memberId}")
    public TripMember updateMember(
            @PathVariable Long memberId,
            @RequestBody TripMember member,
            Authentication authentication) {

        String email = authentication.getName();

        return tripMemberService.updateMember(
                memberId,
                member,
                email
        );
    }

    // 刪除成員
    @DeleteMapping("/{memberId}")
    public ResponseEntity<Void> deleteMember(
            @PathVariable Long memberId,
            Authentication authentication) {

        String email = authentication.getName();

        tripMemberService.deleteMember(
                memberId,
                email
        );

        return ResponseEntity.noContent().build();
    }
}