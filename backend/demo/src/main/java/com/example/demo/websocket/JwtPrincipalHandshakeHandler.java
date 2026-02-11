package com.example.demo.websocket;

import com.example.demo.model.User;
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
        Object userObj = attributes.get("user");
        if (userObj instanceof User user) {
            return new StompUserPrincipal(user.getId(), user.getRole());
        }
        return null;
    }
}
