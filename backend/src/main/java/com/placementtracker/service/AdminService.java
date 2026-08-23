package com.placementtracker.service;

import com.placementtracker.dto.*;
import com.placementtracker.entity.LoginActivity;
import com.placementtracker.entity.User;
import com.placementtracker.enums.LoginStatus;
import com.placementtracker.enums.Role;
import com.placementtracker.exception.ResourceNotFoundException;
import com.placementtracker.exception.UnauthorizedException;
import com.placementtracker.repository.LoginActivityRepository;
import com.placementtracker.repository.PlacementApplicationRepository;
import com.placementtracker.repository.UserRepository;
import com.placementtracker.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final LoginActivityRepository loginActivityRepository;
    private final PlacementApplicationRepository placementRepository;
    private final UserService userService;

    public AdminDashboardResponse getDashboard() {
        List<LoginActivityResponse> recentLogins = loginActivityRepository
                .findTop10ByOrderByLoginTimeDesc()
                .stream()
                .map(this::toLoginActivityResponse)
                .toList();

        return AdminDashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalPlacements(placementRepository.count())
                .onlineUsers(loginActivityRepository.countByStatus(LoginStatus.ONLINE))
                .totalLoginActivities(loginActivityRepository.count())
                .recentLogins(recentLogins)
                .build();
    }

    public PageResponse<UserResponse> getAllUsers(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> users = userRepository.searchUsers(search, pageable);
        return PageUtils.toPageResponse(users, u -> userService.toUserResponse(u, true));
    }

    public UserResponse getUserDetails(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userService.toUserResponse(user, true);
    }

    @Transactional
    public void deleteUser(Long id, User currentAdmin) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getId().equals(currentAdmin.getId())) {
            throw new UnauthorizedException("Cannot delete your own account");
        }

        if (user.getRole() == Role.ADMIN) {
            throw new UnauthorizedException("Cannot delete admin accounts");
        }

        userRepository.delete(user);
    }

    public PageResponse<LoginActivityResponse> getLoginActivities(String search, LoginStatus status,
                                                                  LocalDate fromDate, LocalDate toDate,
                                                                  int page, int size) {
        LocalDateTime from = fromDate != null ? fromDate.atStartOfDay() : null;
        LocalDateTime to = toDate != null ? toDate.atTime(LocalTime.MAX) : null;

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "loginTime"));
        Page<LoginActivity> activities = loginActivityRepository.searchActivities(
                search, status, from, to, pageable);
        return PageUtils.toPageResponse(activities, this::toLoginActivityResponse);
    }

    private LoginActivityResponse toLoginActivityResponse(LoginActivity activity) {
        return LoginActivityResponse.builder()
                .id(activity.getId())
                .userId(activity.getUser().getId())
                .userName(activity.getUserName())
                .userEmail(activity.getUserEmail())
                .loginTime(activity.getLoginTime())
                .logoutTime(activity.getLogoutTime())
                .status(activity.getStatus())
                .build();
    }
}
