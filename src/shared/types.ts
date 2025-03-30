// Message interface to match our MongoDB model


export interface User {
    id?: number;
    _id?: string; //
    username: string;
    joinedAt?: string;
  }
  
  export interface UserLogin {
    username: string;
  }
  
  // Message.ts
  export interface Message {
    id: number;
    username: string;
    senderId: number;
    text: string;
    timestamp: string;
  }