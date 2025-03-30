import "./styles/index.css";
import { Chat } from "./components/Chat";

export function App() {
  return (
    <div className="app">
      <h1>Real-time Chat</h1>
      <p>Welcome to the chat app!</p>
      <Chat />
    </div>
  );
}

export default App;
