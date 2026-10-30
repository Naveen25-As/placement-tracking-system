package com.placementtracker.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @Size(max = 100, message = "Name must be under 100 characters")
    private String name;
    @Size(max = 20, message = "Phone number must be under 20 characters")
    private String phone;
    @Size(max = 255, message = "College name is too long")
    private String college;
}
