package com.placementtracker.controller;

import com.placementtracker.dto.*;
import com.placementtracker.entity.User;
import com.placementtracker.enums.ApplicationStatus;
import com.placementtracker.enums.LoginStatus;
import com.placementtracker.util.SecurityUtils;
import com.placementtracker.service.AdminService;
import com.placementtracker.service.PlacementService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final PlacementService placementService;
    private final SecurityUtils securityUtils;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboard()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllUsers(search, page, size)));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getUserDetails(id)));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        User admin = securityUtils.getCurrentUser();
        adminService.deleteUser(id, admin);
        return ResponseEntity.ok(ApiResponse.success("User deleted", null));
    }

    @GetMapping("/login-activities")
    public ResponseEntity<ApiResponse<PageResponse<LoginActivityResponse>>> getLoginActivities(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) LoginStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<LoginActivityResponse> result = adminService.getLoginActivities(
                search, status, fromDate, toDate, page, size);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/placements")
    public ResponseEntity<ApiResponse<PageResponse<PlacementResponse>>> getPlacements(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) String company,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<PlacementResponse> result = placementService.getAllPlacements(search, status, company, page, size);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
