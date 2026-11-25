package com.example.travelplanner.dto;

import java.time.LocalDate;

public class TravelHistoryResponse {

    private Long id;
    private String name;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;

    public TravelHistoryResponse(
            Long id,
            String name,
            String destination,
            LocalDate startDate,
            LocalDate endDate,
            String status
    ) {
        this.id = id;
        this.name = name;
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDestination() {
        return destination;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getStatus() {
        return status;
    }
}