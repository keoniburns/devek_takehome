import { serve, ServerWebSocket } from "bun";
import index from "../frontend/index.html";
import { wsService, handleNewMessage, handleJoin, handleTyping } from "./chat";
import { handleAuth } from "./auth";
import { join } from "path";
import { handleCors, addCorsHeaders } from "./cors";
import { mkdir, writeFile, exists } from "fs/promises";

// Use absolute path based on script location
const DATA_DIR = join(import.meta.dir, "data");
const MESSAGES_FILE = join(DATA_DIR, "messages.json");
const USERS_FILE = join(DATA_DIR, "users.json");

// Initialize server
async function bootstrap() {
  try {
    console.log("Starting chat server...");

    // Create data directory if it doesn't exist
    try {
      // Create data directory if it doesn't exist
      if (!(await exists(DATA_DIR))) {
        await mkdir(DATA_DIR, { recursive: true }); // Creates directory if it doesn't exist
      }
      if (!(await exists(MESSAGES_FILE))) {
        await writeFile(MESSAGES_FILE, JSON.stringify([]));
      }
      if (!(await exists(USERS_FILE))) {
        await writeFile(USERS_FILE, JSON.stringify([]));
      }
    } catch (error) {
      // Directory might already exist, ignore error
    }

    // Create server
    const server = serve({
      port: 4000,
      fetch(req: Request) {
        // Handle preflight OPTIONS requests using the centralized handler
        const corsResponse = handleCors(req);
        if (corsResponse) {
          return corsResponse;
        }

        // Handle HTTP requests
        const url = new URL(req.url);

        // Authentication routes
        if (url.pathname === "/api/auth/login" && req.method === "POST") {
          return handleAuth(req).then((response) => addCorsHeaders(response));
        }
        if (url.pathname === "/api/auth/register" && req.method === "POST") {
          return handleAuth(req).then((response) => addCorsHeaders(response));
        }

        // WebSocket upgrade
        if (server.upgrade(req)) {
          return;
        }

        // Add CORS headers to all other responses
        const response = new Response(index);

        // Use the centralized addCorsHeaders function
        return addCorsHeaders(response);
      },

      websocket: {
        async open(ws: ServerWebSocket<{ username: string }>) {
          wsService.addClient(ws);
          await wsService.sendHistory(ws);
        },

        async message(ws, message) {
          try {
            const data = JSON.parse(String(message));
            if (data.type === "message") {
              await handleNewMessage(data.message);
            } else if (data.type === "join") {
              await handleJoin(ws, data);
            } else if (data.type === "typing") {
              await handleTyping(data);
            }
          } catch (e) {
            console.error("Error processing message:", e);
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Failed to process your message",
              })
            );
          }
        },

        close(ws) {
          wsService.removeClient(ws);
        },
      },
    });

    console.log(`🚀 Chat server running at ${server.url}`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the application
bootstrap();
