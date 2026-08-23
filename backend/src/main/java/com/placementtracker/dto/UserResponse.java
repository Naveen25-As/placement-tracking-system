package com.placementtracker.dto;

import com.placementtracker.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String college;
    private Role role;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
    private boolean online;
    private long totalApplications;
    private long appliedCount;
    private long shortlistedCount;
    private long interviewCount;
    private long offeredCount;
    private long rejectedCount;
}
