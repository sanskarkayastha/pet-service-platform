package com.example.demo.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

@Component
public class JwtPrincipalHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(
            org.springframework.http.server.ServerHttpRequest request,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {
        Object userIdObj = attributes.get("userId");
        if (userIdObj instanceof String userId && !userId.isBlank()) {
            Object roleObj = attributes.get("role");
            String role = roleObj instanceof String ? (String) roleObj : null;
            return new StompUserPrincipal(userId, role);
        }
        return null;
    }
}
