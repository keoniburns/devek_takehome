import { writeFile, readFile } from 'fs/promises';
import { User, UserLogin } from '../shared/types';

const USERS_FILE = './data/users.json';

// User management
export const authService = {
  async loadUsers() {
    try {
      const data = await readFile(USERS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet or other error
      return [];
    }
  },
  
  async saveUsers(users: User[]) {
    await writeFile(USERS_FILE, JSON.stringify(users), 'utf8');
  },
  
  async register(userData: UserLogin) {
    const users = await this.loadUsers();
    
    // Check if username exists
    if (users.some((u: User) => u.username === userData.username)) {
      throw new Error('Username already taken');
    }
    
    // Generate a unique ID for the new user
    const newId = users.length > 0 ? Math.max(...users.map((u: User) => u.id || 0)) + 1 : 1;
    
    const newUser: User = {
      id: newId,
      username: userData.username,
      joinedAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await this.saveUsers(users);
    return newUser;
  },
  
  async login(credentials: UserLogin) {
    const users = await this.loadUsers();
    const user = users.find((u: User) => u.username === credentials.username);
    
    if (!user) {
      // Auto-register if user doesn't exist
      return this.register(credentials);
    }
    
    return user;
  }
};

// HTTP handlers
export async function handleAuth(req: Request): Promise<Response> {
  try {
    const userData: UserLogin = await req.json();
    
    if (!userData.username) {
      return new Response(
        JSON.stringify({ error: "Username is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Use the login method which already handles both cases
    const user = await authService.login(userData);
    
    return new Response(
      JSON.stringify({ success: true, user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Authentication failed" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
