package com.placementtracker.repository;

import com.placementtracker.entity.LoginActivity;
import com.placementtracker.entity.User;
import com.placementtracker.enums.LoginStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface LoginActivityRepository extends JpaRepository<LoginActivity, Long> {

    Optional<LoginActivity> findTopByUserAndStatusOrderByLoginTimeDesc(User user, LoginStatus status);

    long countByStatus(LoginStatus status);

    List<LoginActivity> findTop10ByOrderByLoginTimeDesc();

    @Query("SELECT la FROM LoginActivity la WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(la.userName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(la.userEmail) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR la.status = :status) " +
           "AND (:fromDate IS NULL OR la.loginTime >= :fromDate) " +
           "AND (:toDate IS NULL OR la.loginTime <= :toDate)")
    Page<LoginActivity> searchActivities(@Param("search") String search,
                                         @Param("status") LoginStatus status,
                                         @Param("fromDate") LocalDateTime fromDate,
                                         @Param("toDate") LocalDateTime toDate,
                                         Pageable pageable);

    @Query("SELECT CASE WHEN COUNT(la) > 0 THEN true ELSE false END FROM LoginActivity la " +
           "WHERE la.user = :user AND la.status = 'ONLINE'")
    boolean isUserOnline(@Param("user") User user);
}
