package com.urbaneye.entity.enums;

/**
 * User account status controlling login and authorization.
 * ACTIVE   → Permitted to authenticate and access authorized resources
 * DISABLED → Account has been deactivated by an administrator
 * LOCKED   → Account temporarily locked due to security or brute-force violations
 */
public enum AccountStatus {
    ACTIVE,
    DISABLED,
    LOCKED
}
