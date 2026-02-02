package com.DevConnect.CollaborationService.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class YjsHandler extends BinaryWebSocketHandler {

    private final Map<String, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String roomId = getRoomId(session);
        rooms.computeIfAbsent(roomId, k -> Collections.synchronizedSet(new HashSet<>())).add(session);
        System.out.println("Added session to room: " + roomId);
    }

    @Override
    public void handleBinaryMessage(WebSocketSession session, BinaryMessage message) {
        String roomId = getRoomId(session);
        Set<WebSocketSession> clients = rooms.getOrDefault(roomId, Collections.emptySet());

        for(WebSocketSession client: clients) {
            if(client.isOpen() && client.getId().equals(session.getId())) {
                try {
                    client.sendMessage(message);
                } catch (Exception e) {
                    System.out.println("Failed to send message to client: " + client.getId());
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String roomId = getRoomId(session);
        Set<WebSocketSession> clients = rooms.get(roomId);
        if (clients != null) {
            clients.remove(session);
            if (clients.isEmpty()) {
                rooms.remove(roomId);
            }
        }
        System.out.println("User left room: " + roomId);
    }

    private String getRoomId(WebSocketSession session) {
        String path = session.getUri().getPath();

        return path.substring(path.lastIndexOf('/') + 1);
    }
}

