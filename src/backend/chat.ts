import { writeFile, readFile } from 'fs/promises';
import { ServerWebSocket } from "bun";
import { Message } from '../shared/types';

const MESSAGES_FILE = './data/messages.json';
const clients: ServerWebSocket<{username: string}>[] = [];

// Message storage
export const messageService = {
  async getMessages() {
    try {
      const data = await readFile(MESSAGES_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet or other error
      return [];
    }
  },
  
  async saveMessage(message: Message) {
    const messages = await this.getMessages();
    messages.push(message);
    await writeFile(MESSAGES_FILE, JSON.stringify(messages), 'utf8');
    return message;
  }
};

// WebSocket management
export const wsService = {
  addClient(ws: ServerWebSocket<{username: string}>) {
    clients.push(ws);
    console.log(`Client connected. Total clients: ${clients.length}`);
  },
  
  removeClient(ws: ServerWebSocket<{username: string}>) {
    const index = clients.indexOf(ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
    console.log(`Client disconnected. Total clients: ${clients.length}`);
  },
  
  async sendHistory(ws: ServerWebSocket<{username: string}>) {
    const messages = await messageService.getMessages();
    ws.send(JSON.stringify({
      type: 'history',
      messages
    }));
  },
  
  broadcast(data: any) {
    const message = JSON.stringify(data);
    for (const client of clients) {
      client.send(message);
    }
  }
};

// Message handling
export async function handleNewMessage(messageData: any) {
  try {
    // Destructure username, text and senderId from the message data
    const { username, text, senderId } = messageData;
    
    // Validate required fields including senderId
    if (!username || !text || !senderId) {
      throw new Error('Invalid message format - username, text and senderId are required');
    }
    
    // Create message object with all required fields
    const message = {
      id: Date.now(), // Use timestamp as unique ID
      username, // Sender's username
      senderId, // Add sender's ID
      text, // Message content
      timestamp: new Date().toISOString() // Current timestamp
    };
    
    // Save message to persistent storage
    await messageService.saveMessage(message);
    
    // Broadcast message to all connected clients
    wsService.broadcast({
      type: 'message',
      message
    });
    
    return message;
  } catch (error) {
    console.error('Error handling message:', error);
    throw error;
  }
}

export async function handleJoin(ws: ServerWebSocket<{username: string}>, data: any) {
  try {
    ws.data = { username: data.username };
    
    wsService.broadcast({
      type: 'system',
      message: `${data.username} has joined the chat`
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error handling join:', error);
    throw error;
  }
}
