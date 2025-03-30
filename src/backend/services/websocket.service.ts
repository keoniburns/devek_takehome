import { ServerWebSocket } from "bun";
import type { ChatMessage } from "../models/Message";
import { dbService } from "./db.service";

export class WebSocketService {
  private clients = new Set<ServerWebSocket>();

  addClient(ws: ServerWebSocket) {
    this.clients.add(ws);
  }

  removeClient(ws: ServerWebSocket) {
    this.clients.delete(ws);
  }

  async sendHistory(ws: ServerWebSocket) {
    try {
      const history = await dbService.getRecentMessages(50);
      
      ws.send(JSON.stringify({
        type: 'history',
        messages: history.reverse()
      }));
    } catch (error) {
      console.error("Error sending history:", error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Could not retrieve chat history'
      }));
    }
  }

  broadcast(message: ChatMessage | any) {
    const broadcastData = JSON.stringify({
      type: 'message',
      message
    });

    for (const client of this.clients) {
      client.send(broadcastData);
    }
  }
  
  broadcastExcept(excludeWs: ServerWebSocket, data: any) {
    const broadcastData = JSON.stringify(data);

    for (const client of this.clients) {
      if (client !== excludeWs) {
        client.send(broadcastData);
      }
    }
  }
}

export const wsService = new WebSocketService();