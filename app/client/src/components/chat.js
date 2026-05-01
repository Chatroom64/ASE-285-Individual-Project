import { useEffect, useState, useRef } from "react";
import { connectSocket, sendMessage } from "../services/socket";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState("");
  const [conversationId, setConversationId] = useState(null);

  const streamingRef = useRef("");

  useEffect(() => {
    connectSocket(handleIncoming);
  }, []);

  function handleIncoming(data) {
    if (data.type === "conversation_created") {
      setConversationId(data.conversationId);
    }

    if (data.type === "token") {
      streamingRef.current += data.token;
      setStreaming(streamingRef.current);
    }

    if (data.type === "done") {
      const finalMessage = streamingRef.current;
        
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: finalMessage }
      ]);
    
      streamingRef.current = "";
      setStreaming("");
    }
  }

  function handleSend() {
    if (!input.trim()) return;

    setMessages(prev => [
      ...prev,
      { role: "user", content: input }
    ]);

    sendMessage({
      prompt: input,
      ...(conversationId && {conversationId})
    });

    setInput("");
    streamingRef.current = "";
    setStreaming("");
  }

  return (
    <div>
      <h2>Chat</h2>

      <div style={{ border: "1px solid #ccc", height: 300, overflowY: "auto", padding: 10 }}>
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