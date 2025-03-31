import { writeFile, readFile } from "fs/promises";
import { User } from "../shared/types";
import { join } from "path";
import * as bcrypt from 'bcrypt';

const USERS_FILE = join(import.meta.dir, "data", "users.json");

// User management
export const authService = {
  // load existing users from json
  // used for either login or registration
  // can also be used to send specific user data to the frontend
  async loadUsers() {
    try {
      const data = await readFile(USERS_FILE, "utf8");
      // parse the data into an array of users
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet or other error
      return [];
    }
  },

  // save users to json
  // this is essentially our Insert or Update operation
  // if the user already exists, we update the user
  // if the user does not exist, we create a new user
  async saveUsers(users: User[]) {
    await writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  },

  async register(userData: User) {
    const users = await this.loadUsers();

    // Check if username exists
    // usernames will be unique
    if (users.some((u: User) => u.username === userData.username)) {
      throw new Error("Username already taken");
    }
    

    // Generate a unique ID for the new user
    // this is not the best way to do this, but it is a quick and dirty solution
    // we should use a UUID instead
    // this is because we are using a json file to store the users
    // and json files do not support unique identifiers
    const newId =
      users.length > 0 ? Math.max(...users.map((u: User) => u.id || 0)) + 1 : 1;

    // create new user object with our provided data
    const newUser: User = {
      id: newId,
      username: userData.username,
      password: await bcrypt.hash(userData.password, 10),
      joinedAt: new Date().toISOString(),
    };

    // add new user to users array
    users.push(newUser);

    // save users to json
    await this.saveUsers(users);

    // return new user
    return newUser;
  },

  async login(credentials: User) {
    // load users from json
    const users = await this.loadUsers();

    // find user by username
    const user = users.find((u: User) => u.username === credentials.username);

    // Return error if user doesn't exist
    if (!user) {
      throw new Error("User not found");
    }

    // Check password using compare instead of direct comparison
    if (!await bcrypt.compare(credentials.password, user.password)) {
      throw new Error("Incorrect password");
    }

    // Return user if credentials are valid
    return user;
  },
};

// HTTP handlers
export async function handleAuth(req: Request): Promise<Response> {
  try {
    const userData: User = await req.json();
    const url = new URL(req.url);

    if (!userData.username) {
      return new Response(JSON.stringify({ error: "Username is required" }), { status: 400 });
    }

    // Handle login vs registration based on endpoint
    let user;
    if (url.pathname === "/api/auth/login") {
      user = await authService.login(userData);
    } else if (url.pathname === "/api/auth/register") {
      user = await authService.register(userData);
    }

    return new Response(JSON.stringify({ success: true, user }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
