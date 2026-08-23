package com.placementtracker.dto;

import com.placementtracker.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlacementResponse {

    private Long id;
    private String companyName;
    private String jobRole;
    private String location;
    private BigDecimal packageAmount;
    private LocalDate applicationDate;
    private ApplicationStatus status;
    private LocalDate interviewDate;
    private String notes;
    private Long userId;
    private String userName;
    private String userEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
