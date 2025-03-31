import { createTheme, Theme } from "@mui/material";

// Create a comprehensive dark theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3a86ff',
      dark: '#2563eb',
      light: '#60a5fa'
    },
    secondary: {
      main: '#10b981', // Teal color for contrast
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    error: {
      main: '#ef4444',
    },
    success: {
      main: '#22c55e',
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#d1d5db',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
        outlined: {
          borderRadius: '8px',
        },
        text: {
          borderRadius: '8px',
          color: 'rgba(255, 255, 255, 0.5)',
          '&:hover': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.09)', // Light grey background
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.13)',
          },
          '&.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
            borderWidth: 1
          },
          '&.Mui-focused ': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
            borderWidth: 1
          },
          '& .MuiInputBase-input::label': {
            color: 'rgba(255, 255, 255, 0.5)',
            opacity: 1
          },
          '&.Mui-focused .MuiInputBase-input::label': {
            opacity: 0.7
          }
        },
        notchedOutline: {
          borderColor: 'rgba(255, 255, 255, 0.23)',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  },
});

// Common styles for reuse across components
export const commonStyles = {
  fullSize: {
    height: '100%', 
    width: '100%',
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  fullContainer: {
    height: '100vh', 
    width: '100vw', 
    display: 'flex', 
    overflow: 'hidden',
  },
  paper: {
    p: { xs: 2, sm: 3, md: 4 },
    borderRadius: 2,
  },
  responsiveText: {
    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
  },
  form: {
    display: 'flex', 
    flexDirection: 'column', 
    gap: { xs: 1, sm: 2 },
    width: '100%',
    mt: { xs: 1, sm: 2 }
  },
  sendButton: {
    borderRadius: '8px'
  }
};

// Auth component specific styles
export const authStyles = {
  container: {
    ...commonStyles.fullSize,
    ...commonStyles.flexCenter,
    p: { xs: 2, sm: 3 }
  },
  paper: {
    ...commonStyles.paper,
    width: '100%',
    maxWidth: { xs: '95%', sm: '450px', md: '500px' },
    ...commonStyles.flexColumn,
  },
  formContainer: {
    ...commonStyles.form
  },
  switchModeContainer: {
    ...commonStyles.flexColumn,
    alignItems: 'center',
    mt: 2
  }
};

// Chat component specific styles
export const chatStyles = {
  container: {
    ...commonStyles.flexColumn,
    ...commonStyles.fullSize,
    overflow: 'hidden'
  },
  messagesContainer: { 
    flexGrow: 1, 
    overflow: 'auto', 
    ...commonStyles.flexColumn,
    p: 2
  },
  messagesList: {
    height: '100%', 
    p: 2, 
    overflow: 'auto'
  },
  messageItem: (isCurrentUser: boolean) => ({
    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
    mb: 1,
    width: '100%'
  }),
  messageBubble: (isCurrentUser: boolean) => ({
    p: 2,
    minWidth: '20vw',
    maxWidth: '60vw',
    borderRadius: '12px',
    bgcolor: isCurrentUser ? 'rgba(58, 134, 255, 0.6)' : 'background.paper',
    color: isCurrentUser ? 'white' : 'text.primary',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    borderTopRightRadius: isCurrentUser ? '4px' : '12px',
    borderTopLeftRadius: isCurrentUser ? '12px' : '4px'
  }),
  inputContainer: {
    p: 2, 
    borderTop: '1px solid', 
    borderColor: 'divider',
    bgcolor: 'background.paper',
    flexShrink: 0
  },
  inputForm: {
    display: 'flex'
  },
  textField: {
    mr: 1
  }
}; 