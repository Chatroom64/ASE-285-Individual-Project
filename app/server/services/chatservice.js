import Conversation from "../models/conversations.js";
import Message from "../models/messages.js";

export async function handleChat(ws, conversationId, prompt) {
  let convoId = conversationId;

  // if no convo exists, create a new one
  if (!convoId) {
    const convo = await Conversation.create({});
    convoId = convo._id;

    ws.send(JSON.stringify({
      type: "conversation_created",
      conversationId: convoId
    }));
  }

  // Save message
  await Message.create({
    conversationId: convoId,
    role: "user",
    content: prompt
  });

  // Load history
  await Message.find({ conversationId: convoId })
    .sort({ createdAt: 1 })
    .limit(20);

  // I orginally made the API call, but since then, the API tokens expired, so I've created a mock AI.
  function fakeAI(prompt) {
    const text = prompt.toLowerCase();

    if (text.includes("hello")) {
      return "Hello! I'm your local WebSocket chatbot.";
    }

    if (text.includes("name")) {
      return "I am a locally simulated AI running in Node.js.";
    }

    if (text.includes("mongo")) {
      return "Yes — your messages are stored in MongoDB.";
    }

    return `You said: "${prompt}". This is a simulated response.`;
  }

  const response = fakeAI(prompt);

  // Streaming simulation
  let fullResponse = "";
  let i = 0;

  const interval = setInterval(async () => {
    if (i < response.length) {
      const token = response[i];
      fullResponse += token;

      ws.send(JSON.stringify({
        type: "token",
        token
      }));

      i++;
    } else {
      clearInterval(interval);

      await Message.create({
        conversationId: convoId,
        role: "assistant",
        content: fullResponse
      });

      ws.send(JSON.stringify({
        type: "done"
      }));
    }
  }, 20);
}