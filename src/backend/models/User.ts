import { ObjectId } from "mongodb";

export interface User {
  _id: ObjectId;
  username: string;
  createdAt: Date;
  lastSeen: Date;
}