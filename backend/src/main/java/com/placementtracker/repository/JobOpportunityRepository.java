package com.placementtracker.repository;

import com.placementtracker.entity.JobOpportunity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobOpportunityRepository extends JpaRepository<JobOpportunity, Long> {
    List<JobOpportunity> findByCompanyId(Long companyId);
}
