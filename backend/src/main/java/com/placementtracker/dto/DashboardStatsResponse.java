package com.placementtracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {

    private long totalApplications;
    private long applied;
    private long shortlisted;
    private long onlineAssessment;
    private long interviews;
    private long offers;
    private long rejected;
}
