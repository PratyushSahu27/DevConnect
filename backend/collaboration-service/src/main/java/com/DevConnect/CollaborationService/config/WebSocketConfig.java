package com.DevConnect.CollaborationService.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import com.DevConnect.CollaborationService.handler.YjsHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final YjsHandler yjsHandler;

    public WebSocketConfig(YjsHandler yjsHandler) {
        this.yjsHandler = yjsHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(yjsHandler, "/ws").setAllowedOrigins("*");
    }
}