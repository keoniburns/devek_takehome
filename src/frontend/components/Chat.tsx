import React, {useState, useEffect, useRef} from 'react';
import { wsService } from '../../backend/chat';
import { Message } from '@/shared/types';
import { useAuth } from '../AuthContext';
import { wsClient } from '../socket';



export function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set up WebSocket event handlers
  useEffect(() => {
    if (user?.username) {
      // Connect to WebSocket with authentication
      wsClient.connect(user.username);
      
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
  }, [user?.username]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isConnected && user?.username) {
      wsClient.sendMessage(message, user.username);
      setMessage('');
    }
  };

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
          <div key={msg.id} className={`message ${msg.username === user?.username ? 'own-message' : ''}`}>
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

