/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

// Only run the client-side code if we're in a browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const elem = document.getElementById("root")!;
  const app = (
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>
  );

  if (import.meta.hot) {
    const root = (import.meta.hot.data.root ??= createRoot(elem));
    root.render(app);
  } else {
    createRoot(elem).render(app);
  }
}

// Export the App component for potential server-side rendering
export default App;