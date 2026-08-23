package com.placementtracker.service;

import com.placementtracker.dto.ProfileRequest;
import com.placementtracker.dto.ProfileResponse;
import com.placementtracker.entity.StudentProfile;
import com.placementtracker.entity.User;
import com.placementtracker.exception.ResourceNotFoundException;
import com.placementtracker.repository.StudentProfileRepository;
import com.placementtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.function.Predicate;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    public ProfileResponse getProfile(Long userId) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for this user"));
        return toResponse(profile);
    }

    @Transactional
    public ProfileResponse updateProfile(Long userId, ProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseGet(() -> StudentProfile.builder().user(user).build());

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        userRepository.save(user);

        profile.setCollege(request.getCollege());
        profile.setDegree(request.getDegree());
        profile.setBranch(request.getBranch());
        profile.setSemester(request.getSemester());
        profile.setCgpa(request.getCgpa());
        profile.setGraduationYear(request.getGraduationYear());
        profile.setBio(request.getBio());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setPortfolioUrl(request.getPortfolioUrl());

        profile = studentProfileRepository.save(profile);

        return toResponse(profile);
    }

    private ProfileResponse toResponse(StudentProfile profile) {
        User user = profile.getUser();

        return ProfileResponse.builder()
                .id(profile.getId())
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .college(profile.getCollege())
                .degree(profile.getDegree())
                .branch(profile.getBranch())
                .semester(profile.getSemester())
                .cgpa(profile.getCgpa())
                .graduationYear(profile.getGraduationYear())
                .bio(profile.getBio())
                .githubUrl(profile.getGithubUrl())
                .linkedinUrl(profile.getLinkedinUrl())
                .portfolioUrl(profile.getPortfolioUrl())
                .profileCompletionPercentage(calculateCompletion(profile))
                .build();
    }

    /**
     * Profile completion is the percentage of tracked fields that are filled in.
     * Skills/projects/certifications are added in a later module and will be folded
     * into this calculation then.
     */
    private int calculateCompletion(StudentProfile profile) {
        Object[] fields = new Object[] {
                profile.getUser().getPhone(),
                profile.getCollege(),
                profile.getDegree(),
                profile.getBranch(),
                profile.getSemester(),
                profile.getCgpa(),
                profile.getGraduationYear(),
                profile.getBio(),
                profile.getGithubUrl(),
                profile.getLinkedinUrl()
        };

        Predicate<Object> isFilled = value -> {
            if (value == null) return false;
            if (value instanceof String s) return !s.isBlank();
            return true;
        };

        long filled = 0;
        for (Object field : fields) {
            if (isFilled.test(field)) filled++;
        }

        return (int) Math.round((filled * 100.0) / fields.length);
    }
}
