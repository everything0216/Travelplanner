package com.example.travelplanner.dto;

public class BalanceResponse {

    private Long memberId;

    private String memberName;

    private Double totalPaid;

    private Double totalOwed;

    private Double balance;

    public BalanceResponse() {
    }

    public BalanceResponse(
            Long memberId,
            String memberName,
            Double totalPaid,
            Double totalOwed,
            Double balance) {

        this.memberId = memberId;
        this.memberName = memberName;
        this.totalPaid = totalPaid;
        this.totalOwed = totalOwed;
        this.balance = balance;
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public Double getTotalPaid() {
        return totalPaid;
    }

    public void setTotalPaid(Double totalPaid) {
        this.totalPaid = totalPaid;
    }

    public Double getTotalOwed() {
        return totalOwed;
    }

    public void setTotalOwed(Double totalOwed) {
        this.totalOwed = totalOwed;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }
}