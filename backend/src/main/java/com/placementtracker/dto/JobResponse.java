package com.placementtracker.dto;

import com.placementtracker.entity.JobType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
public class JobResponse {
    private Long id;
    private Long companyId;
    private String companyName;
    private String title;
    private String description;
    private String location;
    private JobType jobType;
    private String salary;
    private BigDecimal minimumCgpa;
    private Integer graduationYear;
    private LocalDate deadline;
    private Boolean alreadyApplied;
}
