import { ObjectId } from "mongodb";
import { dbService } from "../services/db.service";
import { wsService } from "../services/websocket.service";
import type { ChatMessage } from "../models/Message";

export async function handleNewMessage(data: any): Promise<ChatMessage> {
  // Create a new message object
  const messageData = {
    userId: new ObjectId(data.userId),
    username: data.username,
    text: data.text,
    timestamp: new Date()
  };

  // Save to database
  const savedMessage = await dbService.saveMessage(messageData);
  
  // Broadcast to all clients
  wsService.broadcast(savedMessage);
  
  return savedMessage;
}

export async function handleJoin(ws: any, data: any): Promise<void> {
  console.log(`User joined: ${data.username}`);
  
  try {
    // Create or update user in database
    const user = await dbService.findOrCreateUser(data.username);
    
    // Notify the client
    ws.send(JSON.stringify({
      type: 'welcome',
      userId: user._id,
      message: `Welcome to the chat, ${data.username}!`
    }));
    
    // Broadcast to others
    wsService.broadcastExcept(ws, {
      type: 'system',
      message: `${data.username} has joined the chat`
    });
  } catch (error) {
    console.error('Error handling join:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Failed to join chat'
    }));
  }
}