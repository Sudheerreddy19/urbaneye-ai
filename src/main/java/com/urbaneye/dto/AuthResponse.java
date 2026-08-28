package com.urbaneye.dto;

/**
 * Response body returned on successful login or registration.
 */
public class AuthResponse {

    private String token;
    private Long   userId;
    private String name;
    private String email;
    private String role;
    private String message;

    public AuthResponse() {}

    private AuthResponse(Builder b) {
        this.token   = b.token;
        this.userId  = b.userId;
        this.name    = b.name;
        this.email   = b.email;
        this.role    = b.role;
        this.message = b.message;
    }

    // ── Builder ───────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String token;
        private Long   userId;
        private String name;
        private String email;
        private String role;
        private String message;

        public Builder token(String v)   { this.token   = v; return this; }
        public Builder userId(Long v)    { this.userId  = v; return this; }
        public Builder name(String v)    { this.name    = v; return this; }
        public Builder email(String v)   { this.email   = v; return this; }
        public Builder role(String v)    { this.role    = v; return this; }
        public Builder message(String v) { this.message = v; return this; }
        public AuthResponse build()      { return new AuthResponse(this); }
    }

    // ── Getters / Setters ─────────────────────────────────────────────────────
    public String getToken()   { return token; }
    public Long   getUserId()  { return userId; }
    public String getName()    { return name; }
    public String getEmail()   { return email; }
    public String getRole()    { return role; }
    public String getMessage() { return message; }

    public void setToken(String token)     { this.token   = token; }
    public void setUserId(Long userId)     { this.userId  = userId; }
    public void setName(String name)       { this.name    = name; }
    public void setEmail(String email)     { this.email   = email; }
    public void setRole(String role)       { this.role    = role; }
    public void setMessage(String message) { this.message = message; }
}
