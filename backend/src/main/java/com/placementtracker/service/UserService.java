package com.placementtracker.service;

import com.placementtracker.dto.UpdateProfileRequest;
import com.placementtracker.dto.UserResponse;
import com.placementtracker.entity.User;
import com.placementtracker.enums.ApplicationStatus;
import com.placementtracker.exception.ResourceNotFoundException;
import com.placementtracker.repository.LoginActivityRepository;
import com.placementtracker.repository.PlacementApplicationRepository;
import com.placementtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PlacementApplicationRepository placementRepository;
    private final LoginActivityRepository loginActivityRepository;

    public UserResponse getProfile(User user) {
        return toUserResponse(user, true);
    }

    @Transactional
    public UserResponse updateProfile(User user, UpdateProfileRequest request) {
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getCollege() != null) {
            user.setCollege(request.getCollege());
        }
        userRepository.save(user);
        return toUserResponse(user, true);
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toUserResponse(user, true);
    }

    public UserResponse toUserResponse(User user, boolean includeStats) {
        UserResponse.UserResponseBuilder builder = UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .college(user.getCollege())
                .role(user.getRole())
                .lastLogin(user.getLastLogin())
                .createdAt(user.getCreatedAt())
                .online(loginActivityRepository.isUserOnline(user));

        if (includeStats) {
            builder.totalApplications(placementRepository.countByUser(user))
                    .appliedCount(placementRepository.countByUserAndStatus(user, ApplicationStatus.APPLIED))
                    .shortlistedCount(placementRepository.countByUserAndStatus(user, ApplicationStatus.SHORTLISTED))
                    .interviewCount(placementRepository.countByUserAndStatus(user, ApplicationStatus.INTERVIEW))
                    .offeredCount(placementRepository.countByUserAndStatus(user, ApplicationStatus.OFFERED))
                    .rejectedCount(placementRepository.countByUserAndStatus(user, ApplicationStatus.REJECTED));
        }

        return builder.build();
    }
}
