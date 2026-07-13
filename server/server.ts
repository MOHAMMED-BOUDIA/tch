import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Invalid messages array" });
        return;
      }

      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let mockReply = "I am processing the data from the recent deployments. Performance metrics are looking highly optimized.";
      if (lastMessage.includes("report") || lastMessage.includes("latency")) {
        mockReply = "Here is the summary of latency improvements:\n- **EU-West**: -34ms (24% reduction)\n- **US-East**: -18ms\n- **Tokyo**: Under investigation (slight outlier detected in database pooling).\n\nWould you like me to run an automated query optimization?";
      } else if (lastMessage.includes("hello") || lastMessage.includes("hi")) {
        mockReply = "Welcome back, Alex. I've finished processing the analytics for the **Nexus Core** deployment. Performance is up by 24% and latency has decreased significantly in EU-West. Would you like to see the full report?";
      }
      res.json({ content: mockReply });
    } catch (error: any) {
      console.error("Server Error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Serve static client build in production
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("/{*path}", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  const PORT = 5000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
