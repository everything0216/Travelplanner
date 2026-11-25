package com.example.travelplanner.dto;

public class TravelStatsResponse {

    private long totalTrips;

    private long destinations;

    private long travelDays;

    private double totalExpenses;

    public TravelStatsResponse() {
    }

    public TravelStatsResponse(
            long totalTrips,
            long destinations,
            long travelDays,
            double totalExpenses
    ) {
        this.totalTrips = totalTrips;
        this.destinations = destinations;
        this.travelDays = travelDays;
        this.totalExpenses = totalExpenses;
    }

    public long getTotalTrips() {
        return totalTrips;
    }

    public void setTotalTrips(long totalTrips) {
        this.totalTrips = totalTrips;
    }

    public long getDestinations() {
        return destinations;
    }

    public void setDestinations(long destinations) {
        this.destinations = destinations;
    }

    public long getTravelDays() {
        return travelDays;
    }

    public void setTravelDays(long travelDays) {
        this.travelDays = travelDays;
    }

    public double getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(double totalExpenses) {
        this.totalExpenses = totalExpenses;
    }
}