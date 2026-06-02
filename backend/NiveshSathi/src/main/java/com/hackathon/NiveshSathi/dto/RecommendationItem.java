package com.hackathon.NiveshSathi.dto;

import lombok.Data;

@Data
public class RecommendationItem {

    private String scheme_name;
    private Double past_1yr;
    private Double expected;
    private Double best_case;
    private Double worst_case;
    private String risk;
    private Double score;
}
