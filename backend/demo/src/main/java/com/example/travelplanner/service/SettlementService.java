package com.example.travelplanner.service;

import com.example.travelplanner.dto.BalanceResponse;
import com.example.travelplanner.entity.Expense;
import com.example.travelplanner.entity.ExpenseParticipant;
import com.example.travelplanner.entity.Trip;
import com.example.travelplanner.entity.TripMember;
import com.example.travelplanner.repository.ExpenseParticipantRepository;
import com.example.travelplanner.repository.ExpenseRepository;
import com.example.travelplanner.repository.TripRepository;
import com.example.travelplanner.dto.SettlementResponse;
import org.springframework.stereotype.Service;



import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Comparator;
@Service
public class SettlementService {

    private final TripRepository tripRepository;
    private final ExpenseRepository expenseRepository;
    private final ExpenseParticipantRepository expenseParticipantRepository;

    public SettlementService(
            TripRepository tripRepository,
            ExpenseRepository expenseRepository,
            ExpenseParticipantRepository expenseParticipantRepository) {

        this.tripRepository = tripRepository;
        this.expenseRepository = expenseRepository;
        this.expenseParticipantRepository = expenseParticipantRepository;
    }

    public List<BalanceResponse> calculateBalances(Long tripId) {

        // 1. 找旅行
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        // 2. 取得這趟旅行所有 Expense
        List<Expense> expenses =
                expenseRepository.findByTripId(tripId);

        // 3. 取得所有分帳資料
        List<ExpenseParticipant> participants =
                expenseParticipantRepository
                        .findByExpenseTripId(tripId);

        // 4. 建立每個人的 totalPaid / totalOwed
        Map<Long, BigDecimal> totalPaid = new HashMap<>();
        Map<Long, BigDecimal> totalOwed = new HashMap<>();

        for (TripMember member : trip.getMembers()) {

            totalPaid.put(member.getId(), BigDecimal.ZERO);
            totalOwed.put(member.getId(), BigDecimal.ZERO);
        }

        // 5. 計算每個人實際付了多少
        for (Expense expense : expenses) {

            Long memberId = expense.getPaidBy().getId();

            BigDecimal current =
                    totalPaid.get(memberId);

            totalPaid.put(
                    memberId,
                    current.add(
                            BigDecimal.valueOf(
                                    expense.getAmount()
                            )
                    )
            );
        }

        // 6. 計算每個人應該負擔多少
        for (ExpenseParticipant participant : participants) {

            Long memberId =
                    participant.getMember().getId();

            BigDecimal current =
                    totalOwed.get(memberId);

            totalOwed.put(
                    memberId,
                    current.add(
                            BigDecimal.valueOf(
                                    participant.getShareAmount()
                            )
                    )
            );
        }

        // 7. 計算最後 Balance
        List<BalanceResponse> result = new ArrayList<>();

        for (TripMember member : trip.getMembers()) {

            BigDecimal paid =
                    totalPaid.get(member.getId());

            BigDecimal owed =
                    totalOwed.get(member.getId());

            BigDecimal balance =
                    paid.subtract(owed);

            result.add(
                    new BalanceResponse(
                            member.getId(),
                            member.getName(),
                            paid.doubleValue(),
                            owed.doubleValue(),
                            balance.doubleValue()
                    )
            );
        }

        return result;
    }

    public List<SettlementResponse> calculateSettlements(Long tripId) {

        List<BalanceResponse> balances =
                calculateBalances(tripId);

        List<BalanceResponse> creditors = new ArrayList<>();
        List<BalanceResponse> debtors = new ArrayList<>();

        // 1. 分成「應收」和「欠款」
        for (BalanceResponse balance : balances) {

            if (balance.getBalance() > 0) {
                creditors.add(balance);
            } else if (balance.getBalance() < 0) {
                debtors.add(balance);
            }
        }

        // 2. 建立結果
        List<SettlementResponse> settlements =
                new ArrayList<>();

        int creditorIndex = 0;
        int debtorIndex = 0;

        // 3. 開始配對
        while (
                creditorIndex < creditors.size()
                        && debtorIndex < debtors.size()
        ) {

            BalanceResponse creditor =
                    creditors.get(creditorIndex);

            BalanceResponse debtor =
                    debtors.get(debtorIndex);

            BigDecimal receive =
                    BigDecimal.valueOf(
                            creditor.getBalance()
                    );

            BigDecimal owe =
                    BigDecimal.valueOf(
                            Math.abs(debtor.getBalance())
                    );

            // 4. 取兩者較小的金額
            BigDecimal amount =
                    receive.min(owe);

            settlements.add(
                    new SettlementResponse(
                            debtor.getMemberId(),
                            debtor.getMemberName(),
                            creditor.getMemberId(),
                            creditor.getMemberName(),
                            amount.doubleValue()
                    )
            );

            // 5. 更新剩餘金額

            BigDecimal remainingReceive =
                    receive.subtract(amount);

            BigDecimal remainingOwe =
                    owe.subtract(amount);

            creditor.setBalance(
                    remainingReceive.doubleValue()
            );

            debtor.setBalance(
                    -remainingOwe.doubleValue()
            );

            // 6. 已經結清 → 換下一個人
            if (remainingReceive.compareTo(BigDecimal.ZERO) == 0) {
                creditorIndex++;
            }

            if (remainingOwe.compareTo(BigDecimal.ZERO) == 0) {
                debtorIndex++;
            }
        }

        return settlements;
    }
}