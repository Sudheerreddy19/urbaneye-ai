package com.urbaneye.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Request body for POST /api/auth/google
 */
public class GoogleLoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String name;
    private String picture;
    private String googleId;
    private String token;
    private String role; // Optional: defaults to USER

    public GoogleLoginRequest() {}

    public GoogleLoginRequest(String email, String name, String picture, String googleId, String token, String role) {
        this.email = email;
        this.name = name;
        this.picture = picture;
        this.googleId = googleId;
        this.token = token;
        this.role = role;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }

    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
