package com.hackathon.NiveshSathi.dto;

public class AuthResponse {

    private String token;
    private String name;
    private String email;
    private String profession;

    public AuthResponse() {
    }

    public AuthResponse(String token, String name, String email, String profession) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.profession = profession;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }
}