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
public class AdminDashboardResponse {

    private long totalUsers;
    private long totalPlacements;
    private long onlineUsers;
    private long totalLoginActivities;
    private List<LoginActivityResponse> recentLogins;
}
