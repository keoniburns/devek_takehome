// WebSocket client service for the frontend
class WebSocketClientService {
  private socket: WebSocket | null = null;
  private messageHandlers: ((data: any) => void)[] = [];
  private connectionHandlers: ((connected: boolean) => void)[] = [];
  private reconnectTimer: any = null;
  private username: string | null = null;

  constructor() {
    this.connect = this.connect.bind(this);
  }

  public connect(username: string): void {
    this.username = username;
    
    // Use environment variable if available, otherwise default to window.location
    const backendUrl = "http://localhost:4000";
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = backendUrl.replace(/^http(s)?:/, wsProtocol);
    
    console.log(`Connecting to WebSocket at ${wsUrl}`);
    
    // Close existing connection if any
    if (this.socket) {
      this.socket.close();
    }
    
    this.socket = new WebSocket(wsUrl);
    
    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.notifyConnectionHandlers(true);
      
      // Send join message with username
      this.send({
        type: 'join',
        username: this.username
      });
      
      // Clear reconnect timer if set
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    };
    
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.notifyMessageHandlers(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.notifyConnectionHandlers(false);
      
      // Reconnect after delay
      this.reconnectTimer = setTimeout(() => {
        if (this.username) {
          this.connect(this.username);
        }
      }, 5000);
    };
    
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.username = null;
  }
  
  public send(data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('Cannot send message, WebSocket is not connected');
    }
  }
  
  public sendMessage(text: string): void {
    if (!this.username) {
      console.error('Cannot send message, not logged in');
      return;
    }
    
    this.send({
      type: 'message',
      message: {
        username: this.username,
        text,
        timestamp: new Date()
      }
    });
  }
  
  public onMessage(handler: (data: any) => void): () => void {
    this.messageHandlers.push(handler);
    
    // Return unsubscribe function
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }
  
  public onConnectionChange(handler: (connected: boolean) => void): () => void {
    this.connectionHandlers.push(handler);
    
    // Return unsubscribe function
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
    };
  }
  
  private notifyMessageHandlers(data: any): void {
    this.messageHandlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    });
  }
  
  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach(handler => {
      try {
        handler(connected);
      } catch (error) {
        console.error('Error in connection handler:', error);
      }
    });
  }
}

export const wsClient = new WebSocketClientService(); 