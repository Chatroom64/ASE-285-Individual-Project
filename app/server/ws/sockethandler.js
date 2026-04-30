ws.on("message", async (msg) => {
  const { conversationId, prompt } = JSON.parse(msg);

  await handleChat(ws, conversationId, prompt);
});