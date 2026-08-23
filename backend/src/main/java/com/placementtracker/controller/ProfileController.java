package com.placementtracker.controller;

import com.placementtracker.dto.ProfileRequest;
import com.placementtracker.dto.ProfileResponse;
import com.placementtracker.security.UserPrincipal;
import com.placementtracker.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileResponse> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(profileService.getProfile(principal.getId()));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateMyProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                             @Valid @RequestBody ProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(principal.getId(), request));
    }
}
