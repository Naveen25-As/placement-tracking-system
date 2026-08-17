package com.placementtracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 200, message = "Company name must be under 200 characters")
    private String name;

    private String description;
    private String website;
    private String location;
    private String industry;
    private String companySize;
}
