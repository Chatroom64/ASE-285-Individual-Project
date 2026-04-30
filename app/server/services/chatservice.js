import Message from "../models/Message.js";

export async function handleChat(ws, conversationId, prompt) {
  // 1. Save user message
  await Message.create({
    conversationId,
    role: "user",
    content: prompt
  });

  // 2. Get history
  const history = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .limit(20);

  const messages = history.map(m => ({
    role: m.role,
    content: m.content
  }));

  // 3. Call OpenAI (streaming)
  let fullResponse = "";

  const stream = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages,
    stream: true
  });

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content;

    if (token) {
      fullResponse += token;
      ws.send(JSON.stringify({ token }));
    }
  }

  // 4. Save assistant message
  await Message.create({
    conversationId,
    role: "assistant",
    content: fullResponse
  });

  ws.send(JSON.stringify({ done: true }));
}