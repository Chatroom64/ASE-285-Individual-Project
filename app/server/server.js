import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.join(__dirname, ".env")});
import WebSocket, { WebSocketServer } from "ws";
import { connectDB } from "./db/dbconnection.js";
connectDB();

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws) => {
  ws.on("message", async (message) => {
    const { prompt } = JSON.parse(message);

    // Call OpenAI with streaming
    const stream = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: prompt }],
      stream: true
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;
      if (token) {
        ws.send(JSON.stringify({ token }));
      }
    }

    ws.send(JSON.stringify({ done: true }));
    console.log("Server started on port 3001");
  });
});