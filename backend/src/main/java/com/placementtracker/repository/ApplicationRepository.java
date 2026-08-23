package com.placementtracker.repository;

import com.placementtracker.entity.Application;
import com.placementtracker.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);
    Optional<Application> findByStudentIdAndJobId(Long studentId, Long jobId);
    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);
    long countByStudentIdAndStatus(Long studentId, ApplicationStatus status);
    long countByStatus(ApplicationStatus status);
}
