package com.hackathon.NiveshSathi.dto;

import lombok.Data;
import java.util.List;

@Data
public class RecommendationResponse {
    private List<RecommendationItem> recommendations;
}
