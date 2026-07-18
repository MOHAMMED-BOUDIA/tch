import app from "./app.js";
import { connectDb } from "./db.js";
import { createSocketServer } from "./socket.js";
import http from "http";

async function startServer() {
  await connectDb();

  const server = http.createServer(app);
  createSocketServer(server);

  const PORT = process.env.PORT || 5000;
  server.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
