package com.urbaneye.entity;

import com.urbaneye.entity.enums.Role;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = true, length = 30)
    private String phone;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public User() {}

    private User(Builder b) {
        this.name     = b.name;
        this.email    = b.email;
        this.phone    = b.phone;
        this.password = b.password;
        this.role     = b.role;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String name, email, phone, password;
        private Role   role;

        public Builder name(String v)     { this.name     = v; return this; }
        public Builder email(String v)    { this.email    = v; return this; }
        public Builder phone(String v)    { this.phone    = v; return this; }
        public Builder password(String v) { this.password = v; return this; }
        public Builder role(Role v)       { this.role     = v; return this; }
        public User build()               { return new User(this); }
    }

    public Long          getId()                     { return id; }
    public String        getName()                   { return name; }
    public void          setName(String v)           { this.name = v; }
    public String        getEmail()                  { return email; }
    public void          setEmail(String v)          { this.email = v; }
    public String        getPhone()                  { return phone; }
    public void          setPhone(String v)          { this.phone = v; }
    public String        getPassword()               { return password; }
    public void          setPassword(String v)       { this.password = v; }
    public Role          getRole()                   { return role; }
    public void          setRole(Role v)             { this.role = v; }
    public LocalDateTime getCreatedAt()              { return createdAt; }
}
