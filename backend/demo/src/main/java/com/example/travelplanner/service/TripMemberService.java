package com.example.travelplanner.service;

import com.example.travelplanner.entity.Trip;
import com.example.travelplanner.entity.TripMember;
import com.example.travelplanner.entity.User;
import com.example.travelplanner.repository.TripMemberRepository;
import com.example.travelplanner.repository.TripRepository;
import com.example.travelplanner.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripMemberService {

    private final TripMemberRepository tripMemberRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public TripMemberService(
            TripMemberRepository tripMemberRepository,
            TripRepository tripRepository,
            UserRepository userRepository) {

        this.tripMemberRepository = tripMemberRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    // 新增旅行成員
    public TripMember addMember(
            Long tripId,
            TripMember member,
            String currentUserEmail) {

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() ->
                        new RuntimeException("Trip not found"));

        // 找目前登入的 User
        User currentUser = userRepository
                .findByEmail(currentUserEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 只有 Owner 可以新增成員
        if (!trip.getOwner().getId()
                .equals(currentUser.getId())) {

            throw new RuntimeException(
                    "Only the trip owner can add members"
            );
        }

        // 用 email 找被加入的 User
        User user = userRepository
                .findByEmail(member.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "This email is not registered"
                        ));

        // 避免同一個 User 重複加入
        if (tripMemberRepository
                .findByTripIdAndUser(tripId, user)
                .isPresent()) {

            throw new RuntimeException(
                    "This user is already a member"
            );
        }

        // 建立 TripMember 與 User 的關聯
        member.setUser(user);

        // 使用 User 的資料
        member.setName(user.getNickname());
        member.setEmail(user.getEmail());

        // 設定 Trip
        member.setTrip(trip);

        return tripMemberRepository.save(member);
    }

    // 查詢旅行成員
    public List<TripMember> getMembersByTripId(
            Long tripId,
            String currentUserEmail) {

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() ->
                        new RuntimeException("Trip not found"));

        User currentUser = userRepository
                .findByEmail(currentUserEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 只有 Owner 或 Member 可以查看
        boolean isOwner =
                trip.getOwner().getId()
                        .equals(currentUser.getId());

        boolean isMember =
                tripMemberRepository
                        .findByTripIdAndUser(
                                tripId,
                                currentUser
                        )
                        .isPresent();

        if (!isOwner && !isMember) {
            throw new RuntimeException(
                    "You do not have access to this trip"
            );
        }

        return tripMemberRepository.findByTripId(tripId);
    }

    // 修改旅行成員
    public TripMember updateMember(
            Long memberId,
            TripMember member,
            String currentUserEmail) {

        TripMember existingMember =
                tripMemberRepository.findById(memberId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Member not found"
                                ));

        Trip trip = existingMember.getTrip();

        User currentUser = userRepository
                .findByEmail(currentUserEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 只有 Owner 可以修改成員
        if (!trip.getOwner().getId()
                .equals(currentUser.getId())) {

            throw new RuntimeException(
                    "Only the trip owner can update members"
            );
        }

        existingMember.setName(member.getName());
        existingMember.setEmail(member.getEmail());

        return tripMemberRepository.save(existingMember);
    }

    // 刪除旅行成員
    public void deleteMember(
            Long memberId,
            String currentUserEmail) {

        TripMember member =
                tripMemberRepository.findById(memberId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Member not found"
                                ));

        Trip trip = member.getTrip();

        User currentUser = userRepository
                .findByEmail(currentUserEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 只有 Owner 可以刪除成員
        if (!trip.getOwner().getId()
                .equals(currentUser.getId())) {

            throw new RuntimeException(
                    "Only the trip owner can delete members"
            );
        }

        tripMemberRepository.delete(member);
    }
}