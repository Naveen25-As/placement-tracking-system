package com.placementtracker.controller;

import com.placementtracker.dto.*;
import com.placementtracker.entity.User;
import com.placementtracker.enums.ApplicationStatus;
import com.placementtracker.util.SecurityUtils;
import com.placementtracker.service.PlacementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/placements")
@RequiredArgsConstructor
public class PlacementController {

    private final PlacementService placementService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PlacementResponse>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User user = securityUtils.getCurrentUser();
        PageResponse<PlacementResponse> result = placementService.getUserPlacements(user, search, status, page, size);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats() {
        User user = securityUtils.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(placementService.getDashboardStats(user)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlacementResponse>> getById(@PathVariable Long id) {
        User user = securityUtils.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(placementService.getById(user, id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PlacementResponse>> create(@Valid @RequestBody PlacementRequest request) {
        User user = securityUtils.getCurrentUser();
        PlacementResponse response = placementService.create(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Application created", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PlacementResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody PlacementRequest request) {
        User user = securityUtils.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(placementService.update(user, id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        User user = securityUtils.getCurrentUser();
        placementService.delete(user, id);
        return ResponseEntity.ok(ApiResponse.success("Application deleted", null));
    }
}
