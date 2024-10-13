import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";

import authRoutes from "./routes/auth.routes.js";
import messageRooutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";

dotenv.config();
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 8000;

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRooutes);
app.use("/api/users", userRoutes);

server.listen(port, () => {
  connectToMongoDB();
  console.log(`Server is running on port no. ${port}`);
});
