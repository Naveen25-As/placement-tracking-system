package com.placementtracker.controller;

import com.placementtracker.dto.*;
import com.placementtracker.security.UserPrincipal;
import com.placementtracker.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(applicationService.getMyApplications(principal.getId()));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApplicationStatsResponse> getMyStats(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(applicationService.getMyStats(principal.getId()));
    }

    @PostMapping
    public ResponseEntity<ApplicationResponse> apply(@AuthenticationPrincipal UserPrincipal principal,
                                                       @Valid @RequestBody ApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.apply(principal.getId(), request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(@AuthenticationPrincipal UserPrincipal principal,
                                                              @PathVariable Long id,
                                                              @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        return ResponseEntity.ok(applicationService.updateStatus(principal.getId(), id, request));
    }
}
