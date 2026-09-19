package com.urbaneye.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Brute-force rate limiting service protecting login endpoints.
 * Automatically tracks failed authentication attempts and temporarily blocks accounts.
 */
@Service
public class LoginAttemptService {

    private static final Logger log = LoggerFactory.getLogger(LoginAttemptService.class);

    private final int MAX_ATTEMPTS;
    private final long LOCK_DURATION_MS;

    private static class AttemptRecord {
        int attempts;
        long lastAttemptTimestamp;

        AttemptRecord(int attempts, long lastAttemptTimestamp) {
            this.attempts = attempts;
            this.lastAttemptTimestamp = lastAttemptTimestamp;
        }
    }

    private final Map<String, AttemptRecord> attemptsCache = new ConcurrentHashMap<>();

    public LoginAttemptService(
            @Value("${app.security.max-login-attempts:5}") int maxAttempts,
            @Value("${app.security.lock-duration-minutes:15}") int lockDurationMinutes) {
        this.MAX_ATTEMPTS = maxAttempts;
        this.LOCK_DURATION_MS = lockDurationMinutes * 60L * 1000L;
    }

    public void loginSucceeded(String key) {
        attemptsCache.remove(key.toLowerCase().trim());
    }

    public void loginFailed(String key) {
        String cleanKey = key.toLowerCase().trim();
        long now = System.currentTimeMillis();

        attemptsCache.compute(cleanKey, (k, existing) -> {
            if (existing == null || (now - existing.lastAttemptTimestamp > LOCK_DURATION_MS)) {
                return new AttemptRecord(1, now);
            }
            existing.attempts++;
            existing.lastAttemptTimestamp = now;
            return existing;
        });

        int current = attemptsCache.get(cleanKey).attempts;
        log.warn("Failed login attempt #{} for identifier: {}", current, cleanKey);
    }

    public boolean isBlocked(String key) {
        String cleanKey = key.toLowerCase().trim();
        AttemptRecord record = attemptsCache.get(cleanKey);
        if (record == null) {
            return false;
        }

        long elapsed = System.currentTimeMillis() - record.lastAttemptTimestamp;
        if (elapsed > LOCK_DURATION_MS) {
            attemptsCache.remove(cleanKey);
            return false;
        }

        return record.attempts >= MAX_ATTEMPTS;
    }

    public long getRemainingLockTimeMinutes(String key) {
        String cleanKey = key.toLowerCase().trim();
        AttemptRecord record = attemptsCache.get(cleanKey);
        if (record == null) return 0;
        long elapsed = System.currentTimeMillis() - record.lastAttemptTimestamp;
        long remaining = LOCK_DURATION_MS - elapsed;
        return remaining > 0 ? (remaining / 60000L) + 1 : 0;
    }
}
