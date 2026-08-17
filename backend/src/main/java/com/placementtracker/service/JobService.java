package com.placementtracker.service;

import com.placementtracker.dto.JobRequest;
import com.placementtracker.dto.JobResponse;
import com.placementtracker.entity.Company;
import com.placementtracker.entity.JobOpportunity;
import com.placementtracker.entity.JobType;
import com.placementtracker.exception.ResourceNotFoundException;
import com.placementtracker.repository.ApplicationRepository;
import com.placementtracker.repository.CompanyRepository;
import com.placementtracker.repository.JobOpportunityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobOpportunityRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;

    public List<JobResponse> getAll(Long studentId) {
        return jobRepository.findAll().stream()
                .map(job -> toResponse(job, studentId))
                .toList();
    }

    public JobResponse getById(Long id, Long studentId) {
        return toResponse(findOrThrow(id), studentId);
    }

    @Transactional
    public JobResponse create(JobRequest request) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + request.getCompanyId()));

        JobOpportunity job = JobOpportunity.builder()
                .company(company)
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .jobType(request.getJobType() != null ? request.getJobType() : JobType.FULL_TIME)
                .salary(request.getSalary())
                .minimumCgpa(request.getMinimumCgpa())
                .graduationYear(request.getGraduationYear())
                .deadline(request.getDeadline())
                .build();

        return toResponse(jobRepository.save(job), null);
    }

    @Transactional
    public JobResponse update(Long id, JobRequest request) {
        JobOpportunity job = findOrThrow(id);
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + request.getCompanyId()));

        job.setCompany(company);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        if (request.getJobType() != null) job.setJobType(request.getJobType());
        job.setSalary(request.getSalary());
        job.setMinimumCgpa(request.getMinimumCgpa());
        job.setGraduationYear(request.getGraduationYear());
        job.setDeadline(request.getDeadline());

        return toResponse(jobRepository.save(job), null);
    }

    @Transactional
    public void delete(Long id) {
        JobOpportunity job = findOrThrow(id);
        jobRepository.delete(job);
    }

    private JobOpportunity findOrThrow(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
    }

    private JobResponse toResponse(JobOpportunity job, Long studentId) {
        Boolean alreadyApplied = studentId != null
                ? applicationRepository.existsByStudentIdAndJobId(studentId, job.getId())
                : null;

        return JobResponse.builder()
                .id(job.getId())
                .companyId(job.getCompany().getId())
                .companyName(job.getCompany().getName())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .salary(job.getSalary())
                .minimumCgpa(job.getMinimumCgpa())
                .graduationYear(job.getGraduationYear())
                .deadline(job.getDeadline())
                .alreadyApplied(alreadyApplied)
                .build();
    }
}
