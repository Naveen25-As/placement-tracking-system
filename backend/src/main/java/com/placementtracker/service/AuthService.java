package com.placementtracker.service;

import com.placementtracker.dto.*;
import com.placementtracker.entity.LoginActivity;
import com.placementtracker.entity.User;
import com.placementtracker.enums.LoginStatus;
import com.placementtracker.enums.Role;
import com.placementtracker.exception.DuplicateResourceException;
import com.placementtracker.exception.ResourceNotFoundException;
import com.placementtracker.exception.UnauthorizedException;
import com.placementtracker.repository.LoginActivityRepository;
import com.placementtracker.repository.UserRepository;
import com.placementtracker.security.CustomUserDetailsService;
import com.placementtracker.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final LoginActivityRepository loginActivityRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .college(request.getCollege())
                .role(Role.USER)
                .build();

        userRepository.save(user);

        return loginAfterRegistration(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userDetailsService.loadUserEntityByEmail(request.getEmail());
        return createAuthResponse(user);
    }

    @Transactional
    public void logout(String email, Long loginActivityId) {
        User user = userDetailsService.loadUserEntityByEmail(email);

        LoginActivity activity;
        if (loginActivityId != null) {
            activity = loginActivityRepository.findById(loginActivityId)
                    .orElseThrow(() -> new ResourceNotFoundException("Login activity not found"));
            if (!activity.getUser().getId().equals(user.getId())) {
                throw new UnauthorizedException("Invalid login session");
            }
        } else {
            activity = loginActivityRepository
                    .findTopByUserAndStatusOrderByLoginTimeDesc(user, LoginStatus.ONLINE)
                    .orElse(null);
        }

        if (activity != null && activity.getStatus() == LoginStatus.ONLINE) {
            activity.setStatus(LoginStatus.OFFLINE);
            activity.setLogoutTime(LocalDateTime.now());
            loginActivityRepository.save(activity);
        }
    }

    private AuthResponse loginAfterRegistration(User user) {
        return createAuthResponse(user);
    }

    private AuthResponse createAuthResponse(User user) {
        LocalDateTime now = LocalDateTime.now();
        user.setLastLogin(now);
        userRepository.save(user);

        LoginActivity activity = LoginActivity.builder()
                .user(user)
                .userName(user.getName())
                .userEmail(user.getEmail())
                .loginTime(now)
                .status(LoginStatus.ONLINE)
                .build();
        loginActivityRepository.save(activity);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(
                userDetails,
                user.getId(),
                user.getRole().name(),
                activity.getId()
        );

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .loginActivityId(activity.getId())
                .build();
    }
}
