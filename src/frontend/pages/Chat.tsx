import React, {useState, useEffect, useRef} from 'react';
import { Message } from '@/shared/types';
import { useAuth } from '../context/AuthContext';
import { wsClient } from '../middleware/socket';
import {
  Box, TextField, Button, Paper, Typography,
  List, ListItem, AppBar,
  Toolbar, Chip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { chatStyles, commonStyles } from '../styles/theme';

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
    if (message.trim() && isConnected && user?.username && user?.id) {
      wsClient.sendMessage(message, user.username, user.id);
      setMessage('');
    } else {
      console.error('Error sending message', {
        message: message.trim(),
        isConnected,
        username: user?.username,
        id: user?.id
      });
    }
  };

  return (
    <Box sx={chatStyles.container}>
      <AppBar position="static" elevation={0} sx={{ flexShrink: 0 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome, {user?.username}
          </Typography>
          <Chip 
            icon={<FiberManualRecordIcon sx={{ 
              color: isConnected ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)',
              fontSize: 20
            }}/>} 
            label={isConnected ? 'Connected' : 'Disconnected'} 
            variant="outlined" 
            size="medium"
            sx={{ fontSize: 16, mr: 2 }}
          />
          <Button 
            variant="outlined"
            color="inherit"
            onClick={() => {
              wsClient.disconnect();
              window.location.reload();
            }}
            sx={{ mr: 2 }}
          >
            Logout
          </Button>
          
        </Toolbar>
      </AppBar>
      
      <Box sx={chatStyles.messagesContainer}>
        <Box sx={chatStyles.messagesList}>
          <List>
            {messages.map((msg) => (
              <React.Fragment key={msg.uuid}>
                <ListItem alignItems="flex-start" 
                  sx={chatStyles.messageItem(msg.username === user?.username)}
                >
                  <Paper elevation={1} 
                    sx={chatStyles.messageBubble(msg.username === user?.username)}
                  >
                    <Typography variant="h6" component="div">
                      {msg.username}
                    </Typography>
                    <Typography variant="body1">
                      {msg.text}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'right' }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </ListItem>
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Box>
      </Box>
      
      <Box sx={chatStyles.inputContainer}>
        <Box component="form" onSubmit={handleSendMessage} sx={chatStyles.inputForm}>
          <TextField
            fullWidth
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!isConnected}
            variant="outlined"
            sx={chatStyles.textField}
          />
          <Button 
            type="submit" 
            variant="contained"
            color="inherit"
            endIcon={<SendIcon />}
            disabled={!isConnected}
            sx={commonStyles.sendButton}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

