package com.placementtracker.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProfileRequest {

    private String name;
    private String phone;

    private String college;
    private String degree;
    private String branch;

    @Min(value = 1, message = "Semester must be at least 1")
    @Max(value = 12, message = "Semester must be at most 12")
    private Integer semester;

    @DecimalMin(value = "0.0", message = "CGPA cannot be negative")
    @DecimalMax(value = "10.0", message = "CGPA cannot exceed 10")
    private BigDecimal cgpa;

    private Integer graduationYear;
    private String bio;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
}
