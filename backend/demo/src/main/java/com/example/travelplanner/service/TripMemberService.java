package com.example.travelplanner.service;

import com.example.travelplanner.entity.Trip;
import com.example.travelplanner.entity.TripMember;
import com.example.travelplanner.repository.TripMemberRepository;
import com.example.travelplanner.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripMemberService {

    private final TripMemberRepository tripMemberRepository;
    private final TripRepository tripRepository;

    public TripMemberService(
            TripMemberRepository tripMemberRepository,
            TripRepository tripRepository) {

        this.tripMemberRepository = tripMemberRepository;
        this.tripRepository = tripRepository;
    }

    // 新增旅行成員
    public TripMember addMember(Long tripId, TripMember member) {

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        member.setTrip(trip);

        return tripMemberRepository.save(member);
    }

    public List<TripMember> getMembersByTripId(Long tripId) {

        if (!tripRepository.existsById(tripId)) {
            throw new RuntimeException("Trip not found");
        }

        return tripMemberRepository.findByTripId(tripId);
    }

    public TripMember updateMember(Long memberId, TripMember member) {

        TripMember existingMember = tripMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        existingMember.setName(member.getName());
        existingMember.setEmail(member.getEmail());

        return tripMemberRepository.save(existingMember);
    }

    public void deleteMember(Long memberId) {

        if (!tripMemberRepository.existsById(memberId)) {
            throw new RuntimeException("Member not found");
        }

        tripMemberRepository.deleteById(memberId);
    }
}