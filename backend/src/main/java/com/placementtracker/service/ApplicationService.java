package com.placementtracker.service;

import com.placementtracker.dto.*;
import com.placementtracker.entity.*;
import com.placementtracker.exception.BadRequestException;
import com.placementtracker.exception.DuplicateResourceException;
import com.placementtracker.exception.ResourceNotFoundException;
import com.placementtracker.repository.ApplicationRepository;
import com.placementtracker.repository.JobOpportunityRepository;
import com.placementtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobOpportunityRepository jobRepository;
    private final UserRepository userRepository;

    public List<ApplicationResponse> getMyApplications(Long studentId) {
        return applicationRepository.findByStudentId(studentId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ApplicationResponse apply(Long studentId, ApplicationRequest request) {
        if (applicationRepository.existsByStudentIdAndJobId(studentId, request.getJobId())) {
            throw new DuplicateResourceException("You have already applied to this job");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        JobOpportunity job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + request.getJobId()));

        Application application = Application.builder()
                .student(student)
                .job(job)
                .status(ApplicationStatus.APPLIED)
                .notes(request.getNotes())
                .build();

        return toResponse(applicationRepository.save(application));
    }

    @Transactional
    public ApplicationResponse updateStatus(Long studentId, Long applicationId, ApplicationStatusUpdateRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (!application.getStudent().getId().equals(studentId)) {
            throw new BadRequestException("You can only update your own applications");
        }

        application.setStatus(request.getStatus());
        if (request.getNotes() != null) {
            application.setNotes(request.getNotes());
        }

        return toResponse(applicationRepository.save(application));
    }

    public ApplicationStatsResponse getMyStats(Long studentId) {
        return ApplicationStatsResponse.builder()
                .applied(applicationRepository.countByStudentIdAndStatus(studentId, ApplicationStatus.APPLIED))
                .shortlisted(applicationRepository.countByStudentIdAndStatus(studentId, ApplicationStatus.SHORTLISTED))
                .interview(applicationRepository.countByStudentIdAndStatus(studentId, ApplicationStatus.INTERVIEW))
                .selected(applicationRepository.countByStudentIdAndStatus(studentId, ApplicationStatus.SELECTED))
                .rejected(applicationRepository.countByStudentIdAndStatus(studentId, ApplicationStatus.REJECTED))
                .build();
    }

    public ApplicationStatsResponse getPlatformStats() {
        return ApplicationStatsResponse.builder()
                .applied(applicationRepository.countByStatus(ApplicationStatus.APPLIED))
                .shortlisted(applicationRepository.countByStatus(ApplicationStatus.SHORTLISTED))
                .interview(applicationRepository.countByStatus(ApplicationStatus.INTERVIEW))
                .selected(applicationRepository.countByStatus(ApplicationStatus.SELECTED))
                .rejected(applicationRepository.countByStatus(ApplicationStatus.REJECTED))
                .build();
    }

    private ApplicationResponse toResponse(Application a) {
        return ApplicationResponse.builder()
                .id(a.getId())
                .jobId(a.getJob().getId())
                .jobTitle(a.getJob().getTitle())
                .companyId(a.getJob().getCompany().getId())
                .companyName(a.getJob().getCompany().getName())
                .status(a.getStatus())
                .appliedDate(a.getAppliedDate())
                .notes(a.getNotes())
                .build();
    }
}
