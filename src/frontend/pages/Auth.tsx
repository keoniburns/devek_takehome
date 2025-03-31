import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../middleware/api';
import { Typography, Paper, Box } from '@mui/material';
import { authStyles } from '../styles/theme';
import { AuthForm } from '../components/AuthForm';
import { ModeToggle } from '../components/ModeToggle';

export function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { setAuthUser: login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      if (isRegisterMode) {
        const res = await apiService.register(username.trim(), password.trim());
        setIsRegisterMode(false);
      } else {
        const response = await apiService.login(username.trim(), password.trim());
        login(response.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 
               isRegisterMode ? 'Registration failed' : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleMode = () => setIsRegisterMode(!isRegisterMode);
  
  return (
    <Box sx={authStyles.container}>
      <Paper elevation={1} sx={authStyles.paper}>
        <Typography 
          component="h1" 
          variant="h4"
          align="center" 
          gutterBottom
          sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } }}
        >
          {isRegisterMode ? 'Create Account' : 'Join Chat'}
        </Typography>
        
        <AuthForm
          username={username}
          password={password}
          isLoading={isLoading}
          error={error}
          isRegisterMode={isRegisterMode}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
        />
        
        <ModeToggle
          isRegisterMode={isRegisterMode}
          isLoading={isLoading}
          onToggle={toggleMode}
        />
      </Paper>
    </Box>
  );
} 