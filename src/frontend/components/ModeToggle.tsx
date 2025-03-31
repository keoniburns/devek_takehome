import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { authStyles } from '../styles/theme';

interface ModeToggleProps {
  isRegisterMode: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ 
  isRegisterMode, 
  isLoading, 
  onToggle 
}) => {
  return (
    <Box sx={authStyles.switchModeContainer}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
      </Typography>
      <Button
        disabled={isLoading}
        onClick={onToggle}
        size="small"
        variant="text"
      >
        {isRegisterMode ? 'Login' : 'Register'}
      </Button>
    </Box>
  );
}; 