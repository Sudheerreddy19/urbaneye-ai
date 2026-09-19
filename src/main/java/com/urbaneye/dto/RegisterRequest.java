package com.urbaneye.dto;

import com.urbaneye.entity.enums.Role;
import jakarta.validation.constraints.*;

/**
 * Request body for POST /api/auth/register
 */
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private Role role = Role.CITIZEN;

    // Authorization key required when registering privileged POLICE or HOSPITAL accounts
    private String authorizationKey;

    public RegisterRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role != null ? role : Role.CITIZEN; }
    public void setRole(Role role) { this.role = role; }

    public String getAuthorizationKey() { return authorizationKey; }
    public void setAuthorizationKey(String authorizationKey) { this.authorizationKey = authorizationKey; }
}
