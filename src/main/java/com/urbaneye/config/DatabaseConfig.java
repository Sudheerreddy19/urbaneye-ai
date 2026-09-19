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
import java.net.URI;

/**
 * Intelligent Database Configuration.
 * Automatically detects and parses cloud environment variables (such as Railway, Render,
 * or Heroku's DATABASE_URL: postgresql://user:password@host:port/database)
 * and bridges them into standard PostgreSQL JDBC connections, while seamlessly
 * falling back to individual PG* variables and application.properties.
 */
@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:}")
    private String configuredUrl;

    @Value("${spring.datasource.username:}")
    private String configuredUsername;

    @Value("${spring.datasource.password:}")
    private String configuredPassword;

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

    @Bean
    @Primary
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isBlank()) {
            databaseUrl = System.getenv("DATABASE_PUBLIC_URL");
        }

        HikariConfig config = new HikariConfig();
        config.setDriverClassName(driverClassName);
        config.setMaximumPoolSize(maximumPoolSize);
        config.setMinimumIdle(minimumIdle);
        config.setConnectionTimeout(connectionTimeout);
        config.setIdleTimeout(idleTimeout);
        config.setMaxLifetime(maxLifetime);

        if (databaseUrl != null && !databaseUrl.isBlank() && !databaseUrl.startsWith("${")) {
            try {
                log.info("Configuring DataSource from environment DATABASE_URL...");
                if (databaseUrl.startsWith("jdbc:")) {
                    config.setJdbcUrl(databaseUrl);
                    String user = System.getenv("DATABASE_USERNAME");
                    if (user == null || user.isBlank()) user = System.getenv("PGUSER");
                    if (user != null && !user.isBlank()) config.setUsername(user);

                    String pass = System.getenv("DATABASE_PASSWORD");
                    if (pass == null || pass.isBlank()) pass = System.getenv("PGPASSWORD");
                    if (pass != null && !pass.isBlank()) config.setPassword(pass);
                } else {
                    // Convert standard cloud URI: postgresql://user:password@host:port/database
                    String cleanUrl = databaseUrl;
                    if (cleanUrl.startsWith("postgres://")) {
                        cleanUrl = "postgresql://" + cleanUrl.substring("postgres://".length());
                    }
                    URI uri = URI.create(cleanUrl);
                    String host = uri.getHost();
                    int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                    String path = uri.getPath();
                    String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
                    config.setJdbcUrl(jdbcUrl);

                    if (uri.getUserInfo() != null) {
                        String[] parts = uri.getUserInfo().split(":", 2);
                        config.setUsername(parts[0]);
                        if (parts.length > 1) {
                            config.setPassword(parts[1]);
                        }
                    }
                }
                log.info("DataSource configured from DATABASE_URL: url={}, username={}", config.getJdbcUrl(), config.getUsername());
                return new HikariDataSource(config);
            } catch (Exception e) {
                log.warn("Could not parse DATABASE_URL, falling back to standard properties: {}", e.getMessage());
            }
        }

        // Fallback to spring.datasource.* properties
        log.info("Configuring DataSource from spring.datasource properties: url={}, username={}", configuredUrl, configuredUsername);
        config.setJdbcUrl(configuredUrl);
        config.setUsername(configuredUsername);
        config.setPassword(configuredPassword);
        return new HikariDataSource(config);
    }
}
