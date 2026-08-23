package com.placementtracker.repository;

import com.placementtracker.entity.PlacementApplication;
import com.placementtracker.entity.User;
import com.placementtracker.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PlacementApplicationRepository extends JpaRepository<PlacementApplication, Long> {

    Page<PlacementApplication> findByUser(User user, Pageable pageable);

    Optional<PlacementApplication> findByIdAndUser(Long id, User user);

    long countByUser(User user);

    long countByUserAndStatus(User user, ApplicationStatus status);

    @Query("SELECT p FROM PlacementApplication p WHERE p.user = :user AND " +
           "(:search IS NULL OR :search = '' OR LOWER(p.companyName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.jobRole) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR p.status = :status)")
    Page<PlacementApplication> searchByUser(@Param("user") User user,
                                            @Param("search") String search,
                                            @Param("status") ApplicationStatus status,
                                            Pageable pageable);

    @Query("SELECT p FROM PlacementApplication p WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(p.companyName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.jobRole) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.user.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR p.status = :status) " +
           "AND (:company IS NULL OR :company = '' OR LOWER(p.companyName) LIKE LOWER(CONCAT('%', :company, '%')))")
    Page<PlacementApplication> searchAll(@Param("search") String search,
                                         @Param("status") ApplicationStatus status,
                                         @Param("company") String company,
                                         Pageable pageable);

    List<PlacementApplication> findTop10ByOrderByCreatedAtDesc();
}
