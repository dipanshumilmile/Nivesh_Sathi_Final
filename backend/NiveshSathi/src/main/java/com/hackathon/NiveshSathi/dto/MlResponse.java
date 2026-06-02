package com.hackathon.NiveshSathi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// dto/MlResponse.java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MlResponse {
    private String scheme_name;
    private double past_returns_1yr;
    private double future_returns_1yr;
    private String risk_level;
}

