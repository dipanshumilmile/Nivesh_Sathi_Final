package com.hackathon.NiveshSathi.service;

import com.hackathon.NiveshSathi.dto.MlRequest;
import com.hackathon.NiveshSathi.dto.RecommendationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MlService {

    private final RestTemplate restTemplate;

    @Value("${ml.service.url}")
    private String mlServiceUrl;  // e.g. https://nivesh-sathi-ml-service-1.onrender.com

    public MlService(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    public RecommendationResponse getRecommendation(MlRequest request) {
        String url = mlServiceUrl + "/predict";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<MlRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<RecommendationResponse> response =
                restTemplate.postForEntity(url, entity, RecommendationResponse.class);

        return response.getBody();
    }
}
