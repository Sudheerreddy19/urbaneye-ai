package com.urbaneye.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

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

    @Bean
    @Primary
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        String host = System.getenv("PGHOST");
        String port = System.getenv("PGPORT");
        String database = System.getenv("PGDATABASE");
        String username = System.getenv("PGUSER");
        String password = System.getenv("PGPASSWORD");

        String jdbcUrl;

        // 1. DATABASE_URL priority (Railway PostgreSQL service)
        if (!isInvalidOrPlaceholder(databaseUrl)) {
            String cleanUrl = databaseUrl.trim();
            if (cleanUrl.startsWith("jdbc:")) {
                cleanUrl = cleanUrl.substring(5);
            }
            try {
                java.net.URI uri = new java.net.URI(cleanUrl);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] userPass = userInfo.split(":", 2);
                    if (isInvalidOrPlaceholder(username)) {
                        username = userPass[0];
                    }
                    if (isInvalidOrPlaceholder(password)) {
                        password = userPass[1];
                    }
                } else if (userInfo != null && !userInfo.isBlank()) {
                    if (isInvalidOrPlaceholder(username)) {
                        username = userInfo;
                    }
                }
                String h = uri.getHost();
                int p = uri.getPort() > 0 ? uri.getPort() : 5432;
                String rawPath = uri.getPath();
                String db = (rawPath != null && rawPath.length() > 1) ? rawPath.substring(1) : "urbaneye_db";
                if (uri.getQuery() != null && !uri.getQuery().isBlank()) {
                    jdbcUrl = "jdbc:postgresql://" + h + ":" + p + "/" + db + "?" + uri.getQuery();
                } else {
                    jdbcUrl = "jdbc:postgresql://" + h + ":" + p + "/" + db;
                }
            } catch (Exception e) {
                log.warn("Could not parse DATABASE_URL as URI, using direct conversion: {}", e.getMessage());
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
        else if (!isInvalidOrPlaceholder(host)) {
            String resolvedPort = !isInvalidOrPlaceholder(port) ? port.trim() : "5432";
            String resolvedDb = !isInvalidOrPlaceholder(database) ? database.trim() : "urbaneye_db";
            jdbcUrl = "jdbc:postgresql://" + host.trim() + ":" + resolvedPort + "/" + resolvedDb;
        }
        // 3. spring.datasource.* configuration
        else if (!isInvalidOrPlaceholder(propUrl)) {
            jdbcUrl = propUrl.trim();
        }
        // 4. Local configuration fallback
        else {
            jdbcUrl = "jdbc:postgresql://localhost:5432/urbaneye_db";
        }

        if (isInvalidOrPlaceholder(username)) {
            username = (!isInvalidOrPlaceholder(propUsername)) ? propUsername.trim() : "postgres";
        }

        if (isInvalidOrPlaceholder(password)) {
            if (!isInvalidOrPlaceholder(propPassword)) {
                password = propPassword.trim();
            }
        }

        // Strict validation: Fail fast if password is not configured anywhere
        if (password == null || password.isBlank()) {
            throw new IllegalStateException(
                "PostgreSQL password is not configured! Please provide PGPASSWORD environment variable or spring.datasource.password property."
            );
        }

        log.info("Configuring PostgreSQL DataSource with JDBC URL: {}", jdbcUrl);
        log.info("Database username: {}", username);

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