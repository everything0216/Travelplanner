package com.example.travelplanner.service;

import com.example.travelplanner.dto.CreateExpenseRequest;
import com.example.travelplanner.entity.Expense;
import com.example.travelplanner.entity.ExpenseParticipant;
import com.example.travelplanner.entity.Trip;
import com.example.travelplanner.entity.TripMember;
import com.example.travelplanner.repository.ExpenseParticipantRepository;
import com.example.travelplanner.repository.ExpenseRepository;
import com.example.travelplanner.repository.TripMemberRepository;
import com.example.travelplanner.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseParticipantRepository expenseParticipantRepository;
    private final TripRepository tripRepository;
    private final TripMemberRepository tripMemberRepository;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            ExpenseParticipantRepository expenseParticipantRepository,
            TripRepository tripRepository,
            TripMemberRepository tripMemberRepository) {

        this.expenseRepository = expenseRepository;
        this.expenseParticipantRepository = expenseParticipantRepository;
        this.tripRepository = tripRepository;
        this.tripMemberRepository = tripMemberRepository;
    }

    public Expense createExpense(
            Long tripId,
            CreateExpenseRequest request) {

        // 1. 找旅行
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        // 2. 找付款人
        TripMember paidBy = tripMemberRepository
                .findById(request.getPaidByMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        // 3. 確認付款人屬於這趟旅行
        if (!paidBy.getTrip().getId().equals(tripId)) {
            throw new RuntimeException(
                    "Paid-by member does not belong to this trip"
            );
        }

        // 4. 找所有分帳成員
        List<Long> participantIds = request.getParticipantIds();

        if (participantIds == null || participantIds.isEmpty()) {
            throw new RuntimeException(
                    "At least one participant is required"
            );
        }

        List<TripMember> participants =
                tripMemberRepository.findAllById(participantIds);

        // 5. 確認所有成員都屬於這趟旅行
        if (participants.size() != participantIds.size()) {
            throw new RuntimeException(
                    "Some participants do not exist"
            );
        }

        for (TripMember participant : participants) {

            if (!participant.getTrip().getId().equals(tripId)) {
                throw new RuntimeException(
                        "Participant does not belong to this trip"
                );
            }
        }

        // 6. 建立 Expense
        Expense expense = new Expense();

        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setDate(request.getDate());
        expense.setTrip(trip);
        expense.setPaidBy(paidBy);

        Expense savedExpense = expenseRepository.save(expense);

        // 7. 計算每個人應付多少
        BigDecimal totalAmount =
                BigDecimal.valueOf(request.getAmount());

        BigDecimal share =
                totalAmount.divide(
                        BigDecimal.valueOf(participants.size()),
                        2,
                        RoundingMode.DOWN
                );

        // 8. 建立 ExpenseParticipant
        BigDecimal currentTotal = BigDecimal.ZERO;

        for (int i = 0; i < participants.size(); i++) {

            TripMember participant = participants.get(i);

            BigDecimal shareAmount;

            // 最後一個人補上 rounding 差額
            if (i == participants.size() - 1) {

                shareAmount = totalAmount.subtract(currentTotal);

            } else {

                shareAmount = share;
            }

            ExpenseParticipant expenseParticipant =
                    new ExpenseParticipant();

            expenseParticipant.setExpense(savedExpense);
            expenseParticipant.setMember(participant);
            expenseParticipant.setShareAmount(
                    shareAmount.doubleValue()
            );

            expenseParticipantRepository.save(
                    expenseParticipant
            );

            currentTotal = currentTotal.add(shareAmount);
        }

        return savedExpense;
    }

    public List<Expense> getExpensesByTripId(Long tripId) {

        if (!tripRepository.existsById(tripId)) {
            throw new RuntimeException("Trip not found");
        }

        return expenseRepository.findByTripId(tripId);
    }
}