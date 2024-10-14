import { io } from "socket.io-client";

const socket = io('http://localhost:9000', {
  transports: ['websocket'],
  upgrade: false
});

//  {
// //   // transports: ["websocket", "polling"], // WebSocket fallback
// //   // reconnectionAttempts: 5, // Try to reconnect 5 times if disconnected
// //   // timeout: 20000, // 20-second connection timeout
// //   // autoConnect: true,
// // }
// );

socket.on("connect_error", (err) => {
  console.error("Connection error:", err);
});

socket.on("reconnect_attempt", () => {
  console.log("Attempting to reconnect...");
});

export default socket;
