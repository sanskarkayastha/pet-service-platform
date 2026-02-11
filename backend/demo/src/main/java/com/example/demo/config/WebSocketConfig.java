package com.example.demo.config;

import com.example.demo.websocket.JwtHandshakeInterceptor;
import com.example.demo.websocket.JwtPrincipalHandshakeHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;
    private final JwtPrincipalHandshakeHandler jwtPrincipalHandshakeHandler;

    public WebSocketConfig(
            JwtHandshakeInterceptor jwtHandshakeInterceptor,
            JwtPrincipalHandshakeHandler jwtPrincipalHandshakeHandler
    ) {
        this.jwtHandshakeInterceptor = jwtHandshakeInterceptor;
        this.jwtPrincipalHandshakeHandler = jwtPrincipalHandshakeHandler;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000")
                .addInterceptors(jwtHandshakeInterceptor)
                .setHandshakeHandler(jwtPrincipalHandshakeHandler);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic", "/queue");
    }
}
