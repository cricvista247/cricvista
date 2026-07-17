import express from "express";
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT) || 3004;

const nextApp = next({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

async function startServer() {
  await nextApp.prepare();

  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const parseJson = express.json();

  app.post("/credits-updated", parseJson, (req, res) => {
    const { userId, credits } = req.body;

    console.log(`Sending updated credits to user ${userId}: ${credits}`);

    io.to(`user:${userId}`).emit("credits:updated", {
      credits,
    });

    return res.json({
      success: true,
    });
  });

  app.post("/send-notification", parseJson, (req, res) => {
    const { userId, notification } = req.body;

    console.log(`Sending notification to user ${userId}`);

    io.to(`user:${userId}`).emit("notification:new", {
      notification,
    });

    return res.json({
      success: true,
    });
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // Ticket Chat
    socket.on("join:ticket", (ticketId: string) => {
      console.log(`${socket.id} joined ticket:${ticketId}`);
      socket.join(`ticket:${ticketId}`);
    });

    socket.on("leave:ticket", (ticketId: string) => {
      socket.leave(`ticket:${ticketId}`);
    });

    socket.on("send:message", (data) => {
      socket.to(`ticket:${data.ticketId}`).emit("new:message", data);
    });

    // User Room
    socket.on("join:user", (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`${socket.id} joined user:${userId}`);
    });

    socket.on(
      "credits:updated",
      (data: { userId: string; credits: number }) => {
        console.log(
          `Credits Updated => User: ${data.userId} Credits: ${data.credits}`,
        );

        io.to(`user:${data.userId}`).emit("credits:updated", {
          credits: data.credits,
        });
      },
    );

    socket.on("disconnect", () => {
      console.log(`${socket.id} disconnected`);
    });
  });

  app.use((req, res) => handle(req, res));

  httpServer.listen(port, hostname, () => {
    console.log(
      `> Next.js and Socket.IO ready on http://${hostname}:${port}`,
    );
  });
}

startServer().catch((error) => {
  console.error("Failed to start the server:", error);
  process.exit(1);
});
