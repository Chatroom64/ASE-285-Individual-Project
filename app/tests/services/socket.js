let socket;

export function connectSocket(onMessage) {
  socket = new WebSocket("ws://localhost:3001");

  socket.onopen = () => {
    console.log("Connected to server");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  socket.onclose = () => {
    console.log("Disconnected");
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };
}

export function sendMessage(payload) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
}