package com.placementtracker.config;

import com.placementtracker.entity.User;
import com.placementtracker.enums.Role;
import com.placementtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.name:}")
    private String adminName;

    @Value("${admin.email:}")
    private String adminEmail;

    @Value("${admin.password:}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (adminEmail == null || adminEmail.isBlank()) {
            log.warn("ADMIN_EMAIL not set — skipping default admin creation");
            return;
        }

        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .name(adminName != null && !adminName.isBlank() ? adminName : "Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Default admin account created for {}", adminEmail);
        }
    }
}
