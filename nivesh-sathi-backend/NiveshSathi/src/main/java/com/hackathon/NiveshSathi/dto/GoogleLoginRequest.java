package com.hackathon.NiveshSathi.dto;

public class GoogleLoginRequest {

    private String idToken;
    private String profession;

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }
}