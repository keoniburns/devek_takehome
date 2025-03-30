import { MongoClient, Collection, ObjectId } from "mongodb";
import { DB_CONFIG } from "../config/db";
import { User } from "../models/User";
import { ChatMessage } from "../models/Message";

class DatabaseService {
  private client: MongoClient;
  private connected: boolean = false;
  public users?: Collection<User>;
  public messages?: Collection<ChatMessage>;

  constructor() {
    this.client = new MongoClient(DB_CONFIG.url);
  }

  async connect(): Promise<void> {
    if (this.connected) return;
    
    const maxRetries = 5;
    let retries = 0;
    let lastError: any;
    
    while (retries < maxRetries) {
      try {
        console.log(`Connecting to MongoDB (attempt ${retries + 1}/${maxRetries})...`);
        await this.client.connect();
        console.log("Connected to MongoDB");
        
        const db = this.client.db(DB_CONFIG.dbName);
        this.users = db.collection<User>(DB_CONFIG.collections.users);
        this.messages = db.collection<ChatMessage>(DB_CONFIG.collections.messages);
        
        // Create indexes
        await this.createIndexes();
        
        this.connected = true;
        return;
      } catch (error) {
        lastError = error;
        console.error(`MongoDB connection attempt ${retries + 1} failed:`, error);
        retries++;
        if (retries < maxRetries) {
          // Wait before trying again (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, retries), 10000);
          console.log(`Retrying in ${delay/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    console.error("Failed to connect to MongoDB after multiple attempts");
    throw lastError;
  }

  private async createIndexes(): Promise<void> {
    if (!this.messages || !this.users) {
      throw new Error("Collections not initialized");
    }
    
    await this.messages.createIndex({ timestamp: -1 });
    await this.users.createIndex({ username: 1 }, { unique: true });
  }

  async findOrCreateUser(username: string): Promise<User> {
    if (!this.users) await this.connect();
    if (!this.users) throw new Error("Users collection not available");
    
    // First try to find the user
    let user = await this.users.findOne({ username });
    
    if (!user) {
      // Create a new user if not found
      const newUser: User = {
        _id: new ObjectId(),
        username,
        createdAt: new Date(),
        lastSeen: new Date()
      };
      
      await this.users.insertOne(newUser);
      user = newUser;
    } else {
      // Update last seen
      await this.users.updateOne(
        { _id: user._id },
        { $set: { lastSeen: new Date() } }
      );
    }
    
    return user;
  }

  async saveMessage(message: Omit<ChatMessage, '_id'>): Promise<ChatMessage> {
    if (!this.messages) await this.connect();
    if (!this.messages) throw new Error("Messages collection not available");
    
    const newMessage = {
      _id: new ObjectId(),
      ...message
    };
    
    await this.messages.insertOne(newMessage);
    return newMessage;
  }

  async getRecentMessages(limit: number = 50): Promise<ChatMessage[]> {
    if (!this.messages) await this.connect();
    if (!this.messages) throw new Error("Messages collection not available");
    
    return this.messages
      .find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  }
}

export const dbService = new DatabaseService();