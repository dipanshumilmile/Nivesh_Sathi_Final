package com.hackathon.NiveshSathi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MlRequest {

    private String amc_name;
    private String category;

    private Double investment_amount;
    private Double sip_amount;

    private Integer tenure;
}
