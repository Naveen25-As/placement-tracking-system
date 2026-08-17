package com.placementtracker.dto;

import com.placementtracker.entity.JobType;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class JobRequest {

    @NotNull(message = "Company is required")
    private Long companyId;

    @NotBlank(message = "Job title is required")
    private String title;

    private String description;
    private String location;

    private JobType jobType;

    private String salary;

    @DecimalMin(value = "0.0", message = "Minimum CGPA cannot be negative")
    @DecimalMax(value = "10.0", message = "Minimum CGPA cannot exceed 10")
    private BigDecimal minimumCgpa;

    private Integer graduationYear;
    private LocalDate deadline;
}
