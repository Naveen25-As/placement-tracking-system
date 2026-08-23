package com.placementtracker.dto;

import com.placementtracker.enums.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PlacementRequest {

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Job role is required")
    private String jobRole;

    private String location;

    private BigDecimal packageAmount;

    @NotNull(message = "Application date is required")
    private LocalDate applicationDate;

    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    private LocalDate interviewDate;

    private String notes;
}
