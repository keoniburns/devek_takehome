// Message interface to match our MongoDB model


export interface User {
    id?: number; // unique identifier 
    username: string; // username of the user 
    password: string; // password of the user 
    joinedAt?: string; // date and time of when the user joined the chat 
  }
  
  // Message.ts
  export interface Message {
    uuid: number; // needs to be a uuid 
    username: string; // username of the user 
    senderId: number; // id of the user who sent the message 
    text: string; // text of the message 
    timestamp: string; // date and time of when the message was sent 
  }