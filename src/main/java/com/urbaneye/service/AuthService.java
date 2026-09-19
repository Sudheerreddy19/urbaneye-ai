package com.urbaneye.service;

import com.urbaneye.dto.AuthResponse;
import com.urbaneye.dto.LoginRequest;
import com.urbaneye.dto.RegisterRequest;
import com.urbaneye.entity.User;
import com.urbaneye.entity.enums.AccountStatus;
import com.urbaneye.entity.enums.Role;
import com.urbaneye.repository.UserRepository;
import com.urbaneye.security.JwtTokenProvider;
import com.urbaneye.security.LoginAttemptService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository         userRepository;
    private final PasswordEncoder        passwordEncoder;
    private final JwtTokenProvider       jwtTokenProvider;
    private final AuthenticationManager  authenticationManager;
    private final UserDetailsService     userDetailsService;
    private final LoginAttemptService    loginAttemptService;

    private final String policeProvisionKey;
    private final String hospitalProvisionKey;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       AuthenticationManager authenticationManager,
                       UserDetailsService userDetailsService,
                       LoginAttemptService loginAttemptService,
                       @Value("${app.security.police-key:POLICE_SECURE_2026}") String policeProvisionKey,
                       @Value("${app.security.hospital-key:HOSPITAL_SECURE_2026}") String hospitalProvisionKey) {
        this.userRepository       = userRepository;
        this.passwordEncoder      = passwordEncoder;
        this.jwtTokenProvider     = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.userDetailsService   = userDetailsService;
        this.loginAttemptService  = loginAttemptService;
        this.policeProvisionKey   = policeProvisionKey;
        this.hospitalProvisionKey = hospitalProvisionKey;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered: " + email);
        }

        Role requestedRole = request.getRole() != null ? request.getRole() : Role.CITIZEN;

        // Controlled provisioning: validate authorization key for privileged roles
        if (requestedRole == Role.POLICE) {
            String providedKey = request.getAuthorizationKey() != null ? request.getAuthorizationKey().trim() : "";
            if (!policeProvisionKey.equals(providedKey)) {
                log.warn("Unauthorized POLICE registration attempt for email: {}", email);
                throw new SecurityException("Unauthorized: Valid Police Department Authorization Key required.");
            }
        } else if (requestedRole == Role.HOSPITAL) {
            String providedKey = request.getAuthorizationKey() != null ? request.getAuthorizationKey().trim() : "";
            if (!hospitalProvisionKey.equals(providedKey)) {
                log.warn("Unauthorized HOSPITAL registration attempt for email: {}", email);
                throw new SecurityException("Unauthorized: Valid Hospital Medical Council Key required.");
            }
        } else {
            // Default public registration is always CITIZEN
            requestedRole = Role.CITIZEN;
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(email)
                .phone(request.getPhone() != null ? request.getPhone().trim() : "")
                .password(passwordEncoder.encode(request.getPassword()))
                .role(requestedRole)
                .status(AccountStatus.ACTIVE)
                .build();

        User saved = userRepository.save(user);
        log.info("New user successfully registered: {} [{}]", saved.getEmail(), saved.getRole());
        return buildAuthResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        // 1. Brute-force rate limiting check
        if (loginAttemptService.isBlocked(email)) {
            long remainingMins = loginAttemptService.getRemainingLockTimeMinutes(email);
            log.warn("Blocked login attempt due to rate limiting for email: {}", email);
            throw new LockedException("Too many failed attempts. Account temporarily locked for " + remainingMins + " minutes.");
        }

        // 2. Authenticate against database credentials
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword()));
            loginAttemptService.loginSucceeded(email);
        } catch (BadCredentialsException e) {
            loginAttemptService.loginFailed(email);
            // Generic message prevents account enumeration
            throw new BadCredentialsException("Invalid email or password.");
        } catch (DisabledException e) {
            throw new DisabledException("Account is disabled. Please contact administrator.");
        } catch (LockedException e) {
            throw new LockedException("Account is locked. Please contact administrator.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));

        // 3. Verify Account Status
        if (user.getStatus() == AccountStatus.DISABLED) {
            throw new DisabledException("Account is disabled. Please contact administrator.");
        }
        if (user.getStatus() == AccountStatus.LOCKED) {
            throw new LockedException("Account is locked. Please contact administrator.");
        }

        log.info("Successful login for user: {} [{}]", user.getEmail(), user.getRole());
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
