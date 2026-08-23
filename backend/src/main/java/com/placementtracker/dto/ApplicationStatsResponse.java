package com.placementtracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ApplicationStatsResponse {
    private long applied;
    private long shortlisted;
    private long interview;
    private long selected;
    private long rejected;
}
