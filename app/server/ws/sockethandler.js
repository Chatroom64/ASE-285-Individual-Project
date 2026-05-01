import { handleChat } from "../services/chatService.js";

export function setupWebSocket(wss) {
  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", async (msg) => {
      try {
        const data = JSON.parse(msg);

        const { prompt, conversationId } = data;

        if (!prompt) return;

        await handleChat(ws, conversationId, prompt);

      } catch (err) {
        console.error("WS error:", err);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
}