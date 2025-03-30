import { ObjectId } from "mongodb";

export interface ChatMessage {
  _id: ObjectId;
  userId: ObjectId;
  username: string;
  text: string;
  timestamp: Date;
}