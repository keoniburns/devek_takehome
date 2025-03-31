// api.ts is the middleware between the frontend auth.tsx and the backend auth.ts
// this handles the login and registration of users

const API_URL = "http://localhost:4000/api"; // Adjust this if your backend is on a different domain/port

export const apiService = {
  async register(username: string, password: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    return data;
  },
  async login(username: string, password: string) {
    console.log("login", username, password);
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data;
  },
};
