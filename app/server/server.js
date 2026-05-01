import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.join(__dirname, ".env")});
import WebSocket, { WebSocketServer } from "ws";
import { setupWebSocket } from "./ws/socketHandler.js";
import { connectDB } from "./db/dbconnection.js";
import { handleChat } from "./services/chatService.js";
// These lines will remain in the code, but commented out so that I can prove they existed
// import OpenAI from "openai";
// const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
connectDB();

const wss = new WebSocketServer({ port: 3001 });

setupWebSocket(wss);


console.log("WebSocket server running on ws://localhost:3001");

wss.on("connection", (ws) => {
  ws.on("message", async (msg) => {

    // These lines will remain in the code, but commented out so that I can prove they existed
    // const stream = await openai.chat.completions.create({
    //   model: "gpt-4.1",
    //   messages: [{ role: "user", content: prompt }],
    //   stream: true
    // });

    const { prompt, conversationId } = JSON.parse(msg.toString());

    await handleChat(ws, conversationId, prompt);

    ws.send(JSON.stringify({ done: true }));
    console.log("Server started on port 3001");
  });
});