import { io } from "socket.io-client";

// URL of your order-service
const socket = io("http://localhost:4003");

// Replace this with the customerId from your JWT
const customerId = "c84c4795-79f5-47bf-9be3-e8b4ac7e67df";

// Join the room for this customer
socket.emit("joinRoom", customerId);
console.log(`Joined room for customer: ${customerId}`);

// Listen for order updates
socket.on("orderUpdated", (order) => {
  console.log("Received order update:", order);
});

// Handle connection events
socket.on("connect", () => {
  console.log("Connected to order-service with socket ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
