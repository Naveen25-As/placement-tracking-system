package com.placementtracker.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String name;
    private String phone;
    private String college;
}
