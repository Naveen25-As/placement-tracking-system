package com.placementtracker.dto;

import com.placementtracker.enums.LoginStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginActivityResponse {

    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private LocalDateTime loginTime;
    private LocalDateTime logoutTime;
    private LoginStatus status;
}
