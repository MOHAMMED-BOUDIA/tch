import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini client safely
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } else {
    console.warn("GEMINI_API_KEY is not set. Gemini API endpoint will return mock responses.");
  }

  // API Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Invalid messages array" });
        return;
      }

      const systemInstruction = `
You are "Nexus Assistant", an elite AI-Core V4.2.0 agent designed for Nexus Pro Enterprise Workspace.
Your characteristics:
- High-performance project management bot.
- Crisp, professional, brief, and technical.
- You specialize in systems architecture, real-time analytics, and devops deployments.
- In the conversation, you represent a highly competent, responsive agent.
- Keep responses concise and highly actionable, using rich formatting where helpful (markdown, list items, statistics).
- Mirror the vibe of the premium dark-themed Nexus dashboard.
`;

      if (ai) {
        // Prepare contents from history
        const contents = messages.map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents,
          config: {
            systemInstruction,
          },
        });

        res.json({ content: response.text || "I was unable to formulate a response." });
      } else {
        // Fallback mock responses to prevent crash
        const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
        let mockReply = "I am processing the data from the recent deployments. Performance metrics are looking highly optimized.";
        if (lastMessage.includes("report") || lastMessage.includes("latency")) {
          mockReply = "Here is the summary of latency improvements:\n- **EU-West**: -34ms (24% reduction)\n- **US-East**: -18ms\n- **Tokyo**: Under investigation (slight outlier detected in database pooling).\n\nWould you like me to run an automated query optimization?";
        } else if (lastMessage.includes("hello") || lastMessage.includes("hi")) {
          mockReply = "Welcome back, Alex. I've finished processing the analytics for the **Nexus Core** deployment. Performance is up by 24% and latency has decreased significantly in EU-West. Would you like to see the full report?";
        }
        res.json({ content: mockReply });
      }
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
