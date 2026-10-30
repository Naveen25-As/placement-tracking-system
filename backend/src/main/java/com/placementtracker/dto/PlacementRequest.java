package com.placementtracker.dto;

import com.placementtracker.enums.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PlacementRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 255, message = "Company name is too long")
    private String companyName;

    @NotBlank(message = "Job role is required")
    @Size(max = 255, message = "Job role is too long")
    private String jobRole;

    @Size(max = 255, message = "Location is too long")
    private String location;

    @PositiveOrZero(message = "Package amount cannot be negative")
    private BigDecimal packageAmount;

    @NotNull(message = "Application date is required")
    private LocalDate applicationDate;

    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    private LocalDate interviewDate;

    private String notes;
}
