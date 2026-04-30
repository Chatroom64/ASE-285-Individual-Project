import { useEffect, useState } from "react";
import { connectSocket, sendMessage } from "../../services/socket.js";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState("");

  useEffect(() => {
    connectSocket(handleIncoming);
  }, []);

  function handleIncoming(data) {
    if (data.token) {
      setStreaming(prev => prev + data.token);
    }

    if (data.done) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: streaming }
      ]);
      setStreaming("");
    }
  }

  function handleSend() {
    if (!input.trim()) return;

    // add user message immediately
    setMessages(prev => [
      ...prev,
      { role: "user", content: input }
    ]);

    sendMessage({
      prompt: input,
      conversationId: "test123" // temp for now
    });

    setInput("");
    setStreaming("");
  }

  return (
    <div>
      <h2>Chat</h2>

      <div style={{ border: "1px solid #ccc", padding: 10, height: 300, overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}

        {streaming && (
          <div>
            <strong>assistant:</strong> {streaming}
          </div>
        )}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />

      <button onClick={handleSend}>Send</button>
    </div>
  );
}