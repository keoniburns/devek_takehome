import { serve } from "bun";
import index from "./index.html";
import {WebSocketServer} from "ws";


const server = serve({
  port: 3000,
  routes: {
    "/*": index,
  },
  development: process.env.NODE_ENV !== "production",
});

console.log(`Server is running on http://localhost:${server.port}`);
