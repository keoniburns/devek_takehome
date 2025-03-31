import React from 'react';
import { 
  TextField, Button, Box, CircularProgress, Alert 
} from '@mui/material';
import { authStyles } from '../styles/theme';

interface AuthFormProps {
  username: string;
  password: string;
  isLoading: boolean;
  error: string;
  isRegisterMode: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  username,
  password,
  isLoading,
  error,
  isRegisterMode,
  onUsernameChange,
  onPasswordChange,
  onSubmit
}) => {
  return (
    <>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box component="form" onSubmit={onSubmit} sx={authStyles.formContainer}>
        <TextField
          autoFocus
          disabled={isLoading}
          fullWidth
          label="Username"
          onChange={(e) => onUsernameChange(e.target.value)}
          required
          value={username}
        />
        
        <TextField
          disabled={isLoading}
          fullWidth
          label="Password"
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          type="password"
          value={password}
        />
        
        <Button
          disabled={isLoading}
          fullWidth
          type="submit"
          variant="contained"
          color="inherit"
          sx={{ mt: 1 }}
        >
          {isLoading ? <CircularProgress size={24} /> : isRegisterMode ? 'Register' : 'Login'}
        </Button>
      </Box>
    </>
  );
}; 