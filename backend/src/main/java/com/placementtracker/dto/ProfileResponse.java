package com.placementtracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
public class ProfileResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String college;
    private String degree;
    private String branch;
    private Integer semester;
    private BigDecimal cgpa;
    private Integer graduationYear;
    private String bio;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private int profileCompletionPercentage;
}
