package com.example.travelplanner.dto;

public class SettlementResponse {

    private Long fromMemberId;

    private String fromMemberName;

    private Long toMemberId;

    private String toMemberName;

    private Double amount;

    public SettlementResponse() {
    }

    public SettlementResponse(
            Long fromMemberId,
            String fromMemberName,
            Long toMemberId,
            String toMemberName,
            Double amount) {

        this.fromMemberId = fromMemberId;
        this.fromMemberName = fromMemberName;
        this.toMemberId = toMemberId;
        this.toMemberName = toMemberName;
        this.amount = amount;
    }

    public Long getFromMemberId() {
        return fromMemberId;
    }

    public void setFromMemberId(Long fromMemberId) {
        this.fromMemberId = fromMemberId;
    }

    public String getFromMemberName() {
        return fromMemberName;
    }

    public void setFromMemberName(String fromMemberName) {
        this.fromMemberName = fromMemberName;
    }

    public Long getToMemberId() {
        return toMemberId;
    }

    public void setToMemberId(Long toMemberId) {
        this.toMemberId = toMemberId;
    }

    public String getToMemberName() {
        return toMemberName;
    }

    public void setToMemberName(String toMemberName) {
        this.toMemberName = toMemberName;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}