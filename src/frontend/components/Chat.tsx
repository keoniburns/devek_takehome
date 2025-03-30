import React, {useState, useEffect, useRef} from 'react';
import { wsClient } from '../../backend/services/websocket.client';

// Message interface to match our MongoDB model
interface Message {
  id?: number;
  _id?: string;
  userId?: string;
  username: string;
  text: string;
  timestamp: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set up WebSocket event handlers
  useEffect(() => {
    if (isLoggedIn) {
      // Connect to WebSocket when logged in
      wsClient.connect(username);
      
      // Handle messages from the server
      const messageUnsubscribe = wsClient.onMessage((data) => {
        if (data.type === 'message') {
          setMessages(prev => [...prev, data.message]);
        } else if (data.type === 'history') {
          setMessages(data.messages);
        }
      });
      
      // Handle connection state changes
      const connectionUnsubscribe = wsClient.onConnectionChange((connected) => {
        setIsConnected(connected);
      });
      
      // Clean up on unmount
      return () => {
        messageUnsubscribe();
        connectionUnsubscribe();
        wsClient.disconnect();
      };
    }
  }, [isLoggedIn, username]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isConnected) {
      wsClient.sendMessage(message);
      setMessage('');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="connection-status">
        {isConnected ? 
          <span className="status connected">Connected</span> : 
          <span className="status disconnected">Disconnected</span>
        }
      </div>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id || msg._id} className={`message ${msg.username === username ? 'own-message' : ''}`}>
            <span className="username">{msg.username}</span>
            <span className="text">{msg.text}</span>
            <span className="timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!isConnected}
        />
        <button type="submit" disabled={!isConnected}>Send</button>
      </form>
    </div>
  );
}

