import { serve, ServerWebSocket} from "bun";
import index from "../frontend/index.html";
import { dbService } from "./services/db.service";
import { wsService } from "./services/websocket.service";
import { handleNewMessage, handleJoin } from "./controllers/chat";

// Initialize database and start server
async function bootstrap() {
  try {
    console.log("Connecting to MongoDB...");
    await dbService.connect();
    console.log("MongoDB connected successfully");
    
    // Create server after successful DB connection
    const server = serve({
      port: 4000,
      fetch(req, server) {
        if (server.upgrade(req)) {
          return;
        }
        return new Response(index);
      },
        
      websocket: {
        async open(ws: ServerWebSocket<undefined>) {
          wsService.addClient(ws);
          await wsService.sendHistory(ws);
        },
    
        async message(ws, message) {
          try {
            const data = JSON.parse(String(message));
            if (data.type === 'message') {
              await handleNewMessage(data.message);
            } else if (data.type === 'join') {
              await handleJoin(ws, data);
            }
          } catch (e) {
            console.error('Error processing message:', e);
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Failed to process your message'
            }));
          }
        },
    
        close(ws) {
          wsService.removeClient(ws);
        }
      }
    });
    
    console.log(`🚀 Chat server running at ${server.url}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
bootstrap();
