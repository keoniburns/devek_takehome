// import { WebSocket } from "bun-types";



export const wsClient = {
  socket: null as WebSocket | null,
  messageHandlers: [] as ((data: any) => void)[],
  connectionHandlers: [] as ((connected: boolean) => void)[],
  
  connect(username: string) {
    this.socket = new WebSocket(`ws://${window.location.hostname}:4000`);
    
    this.socket.onopen = () => {
      console.log('Connected to WebSocket');
      this.socket?.send(JSON.stringify({
        type: 'join',
        username
      }));
      
      this.connectionHandlers.forEach(handler => handler(true));
    };
    
    this.socket.onclose = () => {
      console.log('Disconnected from WebSocket');
      this.connectionHandlers.forEach(handler => handler(false));
    };
    
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messageHandlers.forEach(handler => handler(data));
    };
  },
  
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  },
  
  sendMessage(text: string, username: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'message',
        message: {
          username,
          text,
          senderId: username
        }
      }));
    }
  },
  
  onMessage(handler: (data: any) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  },
  
  onConnectionChange(handler: (connected: boolean) => void) {
    this.connectionHandlers.push(handler);
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
    };
  }
};
