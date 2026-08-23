package com.placementtracker.entity;

import com.placementtracker.enums.LoginStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "login_activities", indexes = {
        @Index(name = "idx_login_user_id", columnList = "user_id"),
        @Index(name = "idx_login_time", columnList = "login_time"),
        @Index(name = "idx_login_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "login_time", nullable = false)
    private LocalDateTime loginTime;

    @Column(name = "logout_time")
    private LocalDateTime logoutTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoginStatus status;
}
