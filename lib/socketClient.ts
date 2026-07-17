import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let activeTicketId: string | null = null;
let activeUserId: string | null = null;

const getSocketUrl = (): string => {
  if (typeof window !== "undefined") {
    if (process.env.NEXT_PUBLIC_SOCKET_URL) {
      return process.env.NEXT_PUBLIC_SOCKET_URL;
    }

    // Socket.IO shares the same HTTP server and origin as Next.js.
    return window.location.origin;
  }

  return (
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    `http://127.0.0.1:${process.env.PORT || 3004}`
  );
};

export const getSocket = (): Socket => {
  if (!socket) {
    const SOCKET_URL = getSocketUrl();
    console.log(
      "[Socket] Initializing socket client connecting to:",
      SOCKET_URL,
    );

    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // Re-join ticket room on reconnect (server loses room membership on disconnect)
    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket?.id);
      console.log("[Socket] activeUserId:", activeUserId);
      // console.log("[Socket] Connected successfully with ID:", socket?.id);
      if (activeTicketId) {
        socket?.emit("join:ticket", activeTicketId);
      }

      if (activeUserId) {
        socket?.emit("join:user", activeUserId);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected from server. Reason:", reason);
    });

    socket.on("connect_error", (err) => {
      console.log("[Socket] Connection error details:", err.message);
    });
  }
  return socket;
};

export const connectToTicket = (ticketId: string) => {
  const s = getSocket();
  activeTicketId = ticketId;

  if (s.connected) {
    console.log(
      "[Socket] Already connected, emitting join:ticket for room:",
      ticketId,
    );
    s.emit("join:ticket", ticketId);
  } else {
    console.log(
      "[Socket] Not connected, initiating connection and will join room:",
      ticketId,
    );
    // connect() is safe to call multiple times — socket.io ignores if already connecting
    s.connect();
  }
};

export const connectUserSocket = (userId: string) => {
  const s = getSocket();

  activeUserId = userId;

  console.log("[Socket] connectUserSocket:", userId);
  console.log("[Socket] Connected:", s.connected);

  if (s.connected) {
    console.log("[Socket] Joining user immediately");
    s.emit("join:user", userId);
  } else {
    console.log("[Socket] Connecting...");
    s.connect();
  }
};

export const disconnectFromTicket = (ticketId: string) => {
  const s = getSocket();
  if (activeTicketId === ticketId) {
    activeTicketId = null;
  }
  if (s.connected) {
    console.log("[Socket] Emitting leave:ticket for room:", ticketId);
    s.emit("leave:ticket", ticketId);
  }
};

export const disconnectSocket = () => {
  activeTicketId = null;
  if (socket) {
    console.log("[Socket] Explicitly disconnecting socket client");
    socket.disconnect();
    socket = null;
  }
};

export const disconnectUserSocket = () => {
  activeUserId = null;
};
