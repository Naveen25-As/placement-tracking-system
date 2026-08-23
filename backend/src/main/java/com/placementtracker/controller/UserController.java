package com.placementtracker.controller;

import com.placementtracker.dto.ApiResponse;
import com.placementtracker.dto.UpdateProfileRequest;
import com.placementtracker.dto.UserResponse;
import com.placementtracker.entity.User;
import com.placementtracker.util.SecurityUtils;
import com.placementtracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SecurityUtils securityUtils;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile() {
        User user = securityUtils.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(userService.getProfile(user)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@RequestBody UpdateProfileRequest request) {
        User user = securityUtils.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(userService.updateProfile(user, request)));
    }
}
