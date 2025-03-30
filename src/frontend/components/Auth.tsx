import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

export function Auth() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUsername: login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() })
      });
      
      // First check if response has content
      const contentType = response.headers.get('content-type');
      let errorData: { error: string } = { error: '' };
      
      if (contentType && contentType.includes('application/json')) {
        // Only try to parse JSON if we have JSON content
        const text = await response.text();
        if (text) {
          try {
            errorData = JSON.parse(text);
          } catch (e) {
            console.error('Invalid JSON response:', text);
          }
        }
      }
      
      if (!response.ok) {
        throw new Error(errorData.error || `Login failed (${response.status})`);
      }
      
      // If we got here and have valid JSON data, use it
      const data = errorData;
      login(username.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <h2>Join Chat</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Joining...' : 'Join'}
        </button>
      </form>
    </div>
  );
} 