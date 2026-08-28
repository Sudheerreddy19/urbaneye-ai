package com.urbaneye.service;

import com.urbaneye.dto.AuthResponse;
import com.urbaneye.dto.LoginRequest;
import com.urbaneye.dto.RegisterRequest;
import com.urbaneye.entity.User;
import com.urbaneye.repository.UserRepository;
import com.urbaneye.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.urbaneye.dto.GoogleLoginRequest;
import com.urbaneye.entity.enums.Role;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository      userRepository;
    private final PasswordEncoder     passwordEncoder;
    private final JwtTokenProvider    jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService  userDetailsService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       AuthenticationManager authenticationManager,
                       UserDetailsService userDetailsService) {
        this.userRepository       = userRepository;
        this.passwordEncoder      = passwordEncoder;
        this.jwtTokenProvider     = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.userDetailsService   = userDetailsService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        User saved = userRepository.save(user);
        log.info("Registered: {} [{}]", saved.getEmail(), saved.getRole());
        return buildAuthResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        log.info("Login: {} [{}]", user.getEmail(), user.getRole());
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse googleLogin(GoogleLoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            Role userRole = Role.USER;
            if (request.getRole() != null && !request.getRole().isBlank()) {
                try {
                    userRole = Role.valueOf(request.getRole().trim().toUpperCase());
                } catch (Exception ignored) {}
            }
            String displayName = (request.getName() != null && !request.getName().isBlank())
                    ? request.getName().trim()
                    : email.split("@")[0];

            User newUser = User.builder()
                    .name(displayName)
                    .email(email)
                    .phone("Google Auth")
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(userRole)
                    .build();
            User saved = userRepository.save(newUser);
            log.info("Persisted new Google authenticated user in database: {} [{}]", saved.getEmail(), saved.getRole());
            return saved;
        });

        log.info("Google Login successful for user: {} [{}]", user.getEmail(), user.getRole());
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        UserDetails ud = userDetailsService.loadUserByUsername(user.getEmail());
        String token   = jwtTokenProvider.generateToken(ud, user.getId(), user.getRole().name());
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("Authentication successful")
                .build();
    }
}
