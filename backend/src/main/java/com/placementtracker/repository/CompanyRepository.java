package com.placementtracker.repository;

import com.placementtracker.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    @Query("SELECT c FROM Company c WHERE " +
           "(:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:industry IS NULL OR c.industry = :industry) AND " +
           "(:location IS NULL OR c.location = :location) AND " +
           "(:companySize IS NULL OR c.companySize = :companySize)")
    List<Company> search(@Param("search") String search,
                          @Param("industry") String industry,
                          @Param("location") String location,
                          @Param("companySize") String companySize);
}
