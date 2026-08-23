package com.placementtracker.service;

import com.placementtracker.dto.DashboardStatsResponse;
import com.placementtracker.dto.PageResponse;
import com.placementtracker.dto.PlacementRequest;
import com.placementtracker.dto.PlacementResponse;
import com.placementtracker.entity.PlacementApplication;
import com.placementtracker.entity.User;
import com.placementtracker.enums.ApplicationStatus;
import com.placementtracker.exception.ResourceNotFoundException;
import com.placementtracker.exception.UnauthorizedException;
import com.placementtracker.repository.PlacementApplicationRepository;
import com.placementtracker.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PlacementService {

    private final PlacementApplicationRepository placementRepository;

    public PageResponse<PlacementResponse> getUserPlacements(User user, String search,
                                                             ApplicationStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "applicationDate"));
        Page<PlacementApplication> result = placementRepository.searchByUser(user, search, status, pageable);
        return PageUtils.toPageResponse(result, p -> toResponse(p, false));
    }

    public PlacementResponse getById(User user, Long id) {
        PlacementApplication application = findOwnedApplication(user, id);
        return toResponse(application, false);
    }

    @Transactional
    public PlacementResponse create(User user, PlacementRequest request) {
        PlacementApplication application = PlacementApplication.builder()
                .companyName(request.getCompanyName())
                .jobRole(request.getJobRole())
                .location(request.getLocation())
                .packageAmount(request.getPackageAmount())
                .applicationDate(request.getApplicationDate())
                .status(request.getStatus())
                .interviewDate(request.getInterviewDate())
                .notes(request.getNotes())
                .user(user)
                .build();
        placementRepository.save(application);
        return toResponse(application, false);
    }

    @Transactional
    public PlacementResponse update(User user, Long id, PlacementRequest request) {
        PlacementApplication application = findOwnedApplication(user, id);
        application.setCompanyName(request.getCompanyName());
        application.setJobRole(request.getJobRole());
        application.setLocation(request.getLocation());
        application.setPackageAmount(request.getPackageAmount());
        application.setApplicationDate(request.getApplicationDate());
        application.setStatus(request.getStatus());
        application.setInterviewDate(request.getInterviewDate());
        application.setNotes(request.getNotes());
        placementRepository.save(application);
        return toResponse(application, false);
    }

    @Transactional
    public void delete(User user, Long id) {
        PlacementApplication application = findOwnedApplication(user, id);
        placementRepository.delete(application);
    }

    public DashboardStatsResponse getDashboardStats(User user) {
        return DashboardStatsResponse.builder()
                .totalApplications(placementRepository.countByUser(user))
                .applied(placementRepository.countByUserAndStatus(user, ApplicationStatus.APPLIED))
                .shortlisted(placementRepository.countByUserAndStatus(user, ApplicationStatus.SHORTLISTED))
                .onlineAssessment(placementRepository.countByUserAndStatus(user, ApplicationStatus.ONLINE_ASSESSMENT))
                .interviews(placementRepository.countByUserAndStatus(user, ApplicationStatus.INTERVIEW))
                .offers(placementRepository.countByUserAndStatus(user, ApplicationStatus.OFFERED))
                .rejected(placementRepository.countByUserAndStatus(user, ApplicationStatus.REJECTED))
                .build();
    }

    public PageResponse<PlacementResponse> getAllPlacements(String search, ApplicationStatus status,
                                                            String company, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<PlacementApplication> result = placementRepository.searchAll(search, status, company, pageable);
        return PageUtils.toPageResponse(result, p -> toResponse(p, true));
    }

    private PlacementApplication findOwnedApplication(User user, Long id) {
        return placementRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Placement application not found"));
    }

    public PlacementResponse toResponse(PlacementApplication application, boolean includeUser) {
        PlacementResponse.PlacementResponseBuilder builder = PlacementResponse.builder()
                .id(application.getId())
                .companyName(application.getCompanyName())
                .jobRole(application.getJobRole())
                .location(application.getLocation())
                .packageAmount(application.getPackageAmount())
                .applicationDate(application.getApplicationDate())
                .status(application.getStatus())
                .interviewDate(application.getInterviewDate())
                .notes(application.getNotes())
                .createdAt(application.getCreatedAt())
                .updatedAt(application.getUpdatedAt());

        if (includeUser && application.getUser() != null) {
            builder.userId(application.getUser().getId())
                    .userName(application.getUser().getName())
                    .userEmail(application.getUser().getEmail());
        }

        return builder.build();
    }
}
