package com.urbaneye.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.driver-class-name:org.postgresql.Driver}")
    private String driverClassName;

    @Value("${spring.datasource.hikari.maximum-pool-size:10}")
    private int maximumPoolSize;

    @Value("${spring.datasource.hikari.minimum-idle:2}")
    private int minimumIdle;

    @Value("${spring.datasource.hikari.connection-timeout:30000}")
    private long connectionTimeout;

    @Value("${spring.datasource.hikari.idle-timeout:600000}")
    private long idleTimeout;

    @Value("${spring.datasource.hikari.max-lifetime:1800000}")
    private long maxLifetime;

    @Value("${spring.datasource.url:}")
    private String propUrl;

    @Value("${spring.datasource.username:}")
    private String propUsername;

    @Value("${spring.datasource.password:}")
    private String propPassword;

    private boolean isInvalidOrPlaceholder(String val) {
        if (val == null || val.isBlank()) {
            return true;
        }
        String trimmed = val.trim();
        return trimmed.startsWith("${") ||
               trimmed.equalsIgnoreCase("PGHOST") ||
               trimmed.equalsIgnoreCase("PGPORT") ||
               trimmed.equalsIgnoreCase("PGDATABASE") ||
               trimmed.equalsIgnoreCase("PGUSER") ||
               trimmed.equalsIgnoreCase("PGPASSWORD");
    }

    private String cleanQuotes(String val) {
        if (val == null) return null;
        String trimmed = val.trim();
        if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
            (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
            return trimmed.substring(1, trimmed.length() - 1).trim();
        }
        return trimmed;
    }

    @Bean
    @Primary
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        String host = System.getenv("PGHOST");
        String port = System.getenv("PGPORT");
        String database = System.getenv("PGDATABASE");
        String envUser = cleanQuotes(System.getenv("PGUSER"));
        String envPassword = cleanQuotes(System.getenv("PGPASSWORD"));

        String jdbcUrl = null;
        String username = null;
        String password = null;
        String passwordSource = "none";

        // 1. DATABASE_URL priority (Railway PostgreSQL service)
        if (!isInvalidOrPlaceholder(databaseUrl)) {
            String cleanUrl = databaseUrl.trim();
            if (cleanUrl.startsWith("jdbc:")) {
                cleanUrl = cleanUrl.substring(5);
            }

            try {
                String withoutScheme = cleanUrl;
                if (withoutScheme.contains("://")) {
                    withoutScheme = withoutScheme.substring(withoutScheme.indexOf("://") + 3);
                }

                String urlUser = null;
                String urlPass = null;

                // Split userInfo from host[:port]/database
                if (withoutScheme.contains("@")) {
                    int atIndex = withoutScheme.lastIndexOf('@');
                    String userInfoPart = withoutScheme.substring(0, atIndex);
                    withoutScheme = withoutScheme.substring(atIndex + 1);

                    if (userInfoPart.contains(":")) {
                        int colonIndex = userInfoPart.indexOf(':');
                        urlUser = URLDecoder.decode(userInfoPart.substring(0, colonIndex), StandardCharsets.UTF_8);
                        urlPass = URLDecoder.decode(userInfoPart.substring(colonIndex + 1), StandardCharsets.UTF_8);
                    } else {
                        urlUser = URLDecoder.decode(userInfoPart, StandardCharsets.UTF_8);
                    }
                }

                String urlQuery = null;
                if (withoutScheme.contains("?")) {
                    int qIndex = withoutScheme.indexOf('?');
                    urlQuery = withoutScheme.substring(qIndex + 1);
                    withoutScheme = withoutScheme.substring(0, qIndex);
                }

                String urlHost;
                String urlPort;
                String urlDb;

                if (withoutScheme.contains("/")) {
                    int slashIndex = withoutScheme.indexOf('/');
                    String hostPort = withoutScheme.substring(0, slashIndex);
                    urlDb = withoutScheme.substring(slashIndex + 1);
                    if (hostPort.contains(":")) {
                        urlHost = hostPort.substring(0, hostPort.indexOf(':'));
                        urlPort = hostPort.substring(hostPort.indexOf(':') + 1);
                    } else {
                        urlHost = hostPort;
                        urlPort = "5432";
                    }
                } else {
                    if (withoutScheme.contains(":")) {
                        urlHost = withoutScheme.substring(0, withoutScheme.indexOf(':'));
                        urlPort = withoutScheme.substring(withoutScheme.indexOf(':') + 1);
                    } else {
                        urlHost = withoutScheme;
                        urlPort = "5432";
                    }
                    urlDb = "railway";
                }

                if (urlHost != null && !urlHost.isBlank()) {
                    jdbcUrl = "jdbc:postgresql://" + urlHost + ":" + urlPort + "/" + (urlDb != null && !urlDb.isBlank() ? urlDb : "railway");
                    if (urlQuery != null && !urlQuery.isBlank()) {
                        jdbcUrl += "?" + urlQuery;
                    }
                }

                // Priority 1: Use credentials directly from DATABASE_URL if present
                if (urlUser != null && !urlUser.isBlank()) {
                    username = urlUser;
                }
                if (urlPass != null && !urlPass.isBlank()) {
                    password = cleanQuotes(urlPass);
                    passwordSource = "DATABASE_URL";
                }
            } catch (Exception e) {
                log.warn("Error parsing DATABASE_URL as structured URL: {}. Using fallback conversion.", e.getMessage());
                if (databaseUrl.startsWith("postgres://")) {
                    jdbcUrl = databaseUrl.replace("postgres://", "jdbc:postgresql://");
                } else if (databaseUrl.startsWith("postgresql://")) {
                    jdbcUrl = "jdbc:" + databaseUrl;
                } else {
                    jdbcUrl = databaseUrl;
                }
            }
        }

        // 2. PGHOST + PGPORT + PGDATABASE + PGUSER + PGPASSWORD
        if (jdbcUrl == null) {
            if (!isInvalidOrPlaceholder(host)) {
                String resolvedPort = !isInvalidOrPlaceholder(port) ? port.trim() : "5432";
                String resolvedDb = !isInvalidOrPlaceholder(database) ? database.trim() : "urbaneye_db";
                jdbcUrl = "jdbc:postgresql://" + host.trim() + ":" + resolvedPort + "/" + resolvedDb;
            } else if (!isInvalidOrPlaceholder(propUrl)) {
                jdbcUrl = propUrl.trim();
            } else {
                jdbcUrl = "jdbc:postgresql://localhost:5432/urbaneye_db";
            }
        }

        // Username resolution
        if (username == null || username.isBlank() || isInvalidOrPlaceholder(username)) {
            if (!isInvalidOrPlaceholder(envUser)) {
                username = envUser;
            } else if (!isInvalidOrPlaceholder(propUsername)) {
                username = cleanQuotes(propUsername);
            } else {
                username = "postgres";
            }
        }

        // Password resolution: Fall back to PGPASSWORD / spring.datasource.password if DATABASE_URL had none
        if (password == null || password.isBlank() || isInvalidOrPlaceholder(password)) {
            if (!isInvalidOrPlaceholder(envPassword)) {
                password = envPassword;
                passwordSource = "PGPASSWORD";
            } else if (!isInvalidOrPlaceholder(propPassword)) {
                password = cleanQuotes(propPassword);
                passwordSource = "spring.datasource.password";
            }
        }

        if (password != null) {
            password = cleanQuotes(password);
        }

        // Strict validation
        if (password == null || password.isBlank()) {
            throw new IllegalStateException(
                "PostgreSQL password is not configured! Please provide PGPASSWORD environment variable, DATABASE_URL with credentials, or spring.datasource.password property."
            );
        }

        log.info("Configuring PostgreSQL DataSource with JDBC URL: {}", jdbcUrl);
        log.info("Database username: {}", username);
        log.info("Database password resolved from: {} (length: {})", passwordSource, password.length());

        HikariConfig config = new HikariConfig();

        config.setDriverClassName(driverClassName);
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);

        config.setMaximumPoolSize(maximumPoolSize);
        config.setMinimumIdle(minimumIdle);
        config.setConnectionTimeout(connectionTimeout);
        config.setIdleTimeout(idleTimeout);
        config.setMaxLifetime(maxLifetime);

        return new HikariDataSource(config);
    }
}