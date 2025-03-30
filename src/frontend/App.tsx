import "./styles/index.css";
import { useState } from "react";
import { Chat } from "./components/Chat";
import { Auth } from "./components/Auth";
import { AuthProvider, useAuth } from "./AuthContext";

function AppContent() {
  const { isLoggedIn, username } = useAuth();

  return (
    <div className="app">
      <header>
        <h1>Real-time Chat</h1>
        {isLoggedIn && (
          <div className="user-info">
            <span>Welcome, {username}</span>
          </div>
        )}
      </header>
      
      {isLoggedIn ? <Chat /> : <Auth />}
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
