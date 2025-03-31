import React, { useState, useEffect, useRef } from "react";
import { Message } from "@/shared/types";
import { useAuth } from "../context/AuthContext";
import { wsClient } from "../middleware/socket";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  AppBar,
  Toolbar,
  Chip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { chatStyles, commonStyles } from "../styles/theme";

export function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set up WebSocket event handlers
  useEffect(() => {
    if (user?.username) {
      // Connect to WebSocket with authentication
      wsClient.connect(user.username);

      // Handle messages from the server
      const messageUnsubscribe = wsClient.onMessage((data) => {
        if (data.type === "message") {
          setMessages((prev) => [...prev, data.message]);
        } else if (data.type === "history") {
          setMessages(data.messages);
        } else if (data.type === "typing") {
          // Handle typing indicators
          setTypingUsers(data.typingUsers || []);
        } else if (data.type === "notification") {
          // Handle notifications
          setNotifications((prev) => [...prev, data.message]);

          // Auto-remove notification after 5 seconds
          setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n !== data.message));
          }, 5000);
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);

    // Send typing indicator
    if (newValue && user?.username) {
      // Send typing status (true)
      wsClient.sendTypingStatus(user.username, true);

      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set a timeout to stop typing indicator after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        wsClient.sendTypingStatus(user.username, false);
      }, 2000);
    }
  };

  // Update the message sending to clear typing status
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isConnected && user?.username && user?.id) {
      wsClient.sendMessage(message, user.username, user.id);
      setMessage("");

      // Clear typing status after sending
      wsClient.sendTypingStatus(user.username, false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } else {
      console.error("Error sending message", {
        message: message.trim(),
        isConnected,
        username: user?.username,
        id: user?.id,
      });
    }
  };

  // Render typing indicator
  const renderTypingIndicator = () => {
    const typingUsersWithoutCurrentUser = typingUsers.filter(
      (username) => username !== user?.username
    );

    if (typingUsersWithoutCurrentUser.length === 0) return null;

    return (
      <Box sx={{ p: 1, opacity: 0.7 }}>
        {typingUsersWithoutCurrentUser.join(", ")}{" "}
        {typingUsersWithoutCurrentUser.length === 1 ? "is" : "are"} typing
        <span className="typing-dots">...</span>
      </Box>
    );
  };

  // Render notifications
  const renderNotifications = () => {
    if (notifications.length === 0) return null;

    return (
      <Box sx={{ position: "absolute", top: 70, right: 20, zIndex: 1000 }}>
        {notifications.map((notification, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{ p: 2, mb: 1, backgroundColor: "primary.dark" }}
          >
            <Typography variant="body2" color="white">
              {notification}
            </Typography>
          </Paper>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={chatStyles.container}>
      <AppBar position="static" elevation={0} sx={{ flexShrink: 0 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome, {user?.username}
          </Typography>
          <Chip
            icon={
              <FiberManualRecordIcon
                sx={{
                  color: isConnected ? "rgb(0, 255, 0)" : "rgb(255, 0, 0)",
                  fontSize: 20,
                }}
              />
            }
            label={isConnected ? "Connected" : "Disconnected"}
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

      {/* Render notifications */}
      {renderNotifications()}

      <Box sx={chatStyles.messagesContainer}>
        <Box sx={chatStyles.messagesList}>
          <List>
            {messages.map((msg) => (
              <React.Fragment key={msg.uuid}>
                <ListItem
                  alignItems="flex-start"
                  sx={chatStyles.messageItem(msg.username === user?.username)}
                >
                  <Paper
                    elevation={1}
                    sx={chatStyles.messageBubble(
                      msg.username === user?.username
                    )}
                  >
                    <Typography variant="h6" component="div">
                      {msg.username}
                    </Typography>
                    <Typography variant="body1">{msg.text}</Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1, textAlign: "right" }}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </ListItem>
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </List>

          {/* Render typing indicator */}
          {renderTypingIndicator()}
        </Box>
      </Box>

      <Box sx={chatStyles.inputContainer}>
        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={chatStyles.inputForm}
        >
          <TextField
            fullWidth
            placeholder="Type a message..."
            value={message}
            onChange={handleInputChange}
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
