package com.urbaneye.config;

import com.urbaneye.security.JwtTokenProvider;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.security.Principal;

/**
 * WebSocket / STOMP configuration with JWT authentication and topic authorization.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtTokenProvider  jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    public WebSocketConfig(JwtTokenProvider jwtTokenProvider, UserDetailsService userDetailsService) {
        this.jwtTokenProvider  = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (accessor != null) {
                    // 1. Authenticate JWT token upon STOMP CONNECT
                    if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                        String authHeader = accessor.getFirstNativeHeader("Authorization");
                        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                            authHeader = accessor.getFirstNativeHeader("token");
                        }
                        if (authHeader != null) {
                            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
                            if (jwtTokenProvider.validateToken(token)) {
                                String username = jwtTokenProvider.extractUsername(token);
                                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                                UsernamePasswordAuthenticationToken auth =
                                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                                accessor.setUser(auth);
                            }
                        }
                    }
                    // 2. Authorize channel subscriptions
                    else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                        String destination = accessor.getDestination();
                        if (destination != null) {
                            // Police / Tactical incident feeds require authenticated user
                            if (destination.startsWith("/topic/incidents") || destination.startsWith("/topic/signals")) {
                                Principal user = accessor.getUser();
                                if (user == null) {
                                    throw new AccessDeniedException("Authentication required to subscribe to tactical feed: " + destination);
                                }
                            }
                            // Hospital triage queue requires authenticated user
                            else if (destination.startsWith("/topic/hospital")) {
                                Principal user = accessor.getUser();
                                if (user == null) {
                                    throw new AccessDeniedException("Hospital authentication required to subscribe to emergency dispatch feed.");
                                }
                            }
                        }
                    }
                }
                return message;
            }
        });
    }
}
