import "./styles/index.css";
import { Auth } from "./pages/Auth";
import { Chat } from "./pages/Chat";
import { useAuth } from "./context/AuthContext";
import { Box, ThemeProvider } from "@mui/material";
import { darkTheme, commonStyles } from "./styles/theme";

export default function App() {
  const { user, isLoggedIn } = useAuth();

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={commonStyles.fullContainer}>
        {isLoggedIn ? <Chat /> : <Auth />}
      </Box>
    </ThemeProvider>
  );
}
