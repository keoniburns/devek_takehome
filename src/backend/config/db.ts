export const DB_CONFIG = {
    url: process.env.MONGO_URL || "mongodb://admin:password@localhost:27017",
    dbName: "chat-app",
    collections: {
      users: "users",
      messages: "messages"
    }
  };
