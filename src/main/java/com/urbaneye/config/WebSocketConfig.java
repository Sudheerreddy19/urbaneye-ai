package com.urbaneye.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket / STOMP configuration.
 *
 * Endpoints:
 *   ws://localhost:8080/ws              — Raw WebSocket + SockJS fallback
 *
 * Publish (client → server):
 *   /app/location/ambulance             — GPS ping from ambulance driver
 *   /app/location/bus                   — GPS ping from bus tracker
 *
 * Subscribe (server → client):
 *   /topic/ambulances                   — Live ambulance positions
 *   /topic/buses                        — Live bus positions
 *   /topic/signals                      — Signal state changes (green corridor)
 *   /topic/incidents                    — New incident alerts (police dashboard)
 *   /topic/hospital/{hospitalId}        — Incoming ambulance alerts
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // In-memory broker for topics
        config.enableSimpleBroker("/topic");
        // Prefix for messages routed to @MessageMapping methods
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")  // tighten in production
                .withSockJS();
    }
}
