package com.hackathon.NiveshSathi.dto;

import lombok.Data;

@Data
public class AiInputDto {

    private String fundCategory;
    private String amcPreference;
    private double amount;
    private double sipAmount;
    private int tenure;
}
