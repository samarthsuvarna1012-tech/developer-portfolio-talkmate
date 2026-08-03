import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

const envLocalPath = path.resolve(process.cwd(), ".env.local");
const envPath = path.resolve(process.cwd(), ".env");

dotenv.config({ path: envLocalPath });
dotenv.config({ path: envPath });

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initializer for Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Chat API route for TalkMate AI
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, persona, systemPrompt, temperature } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    const ai = getGeminiClient();

    // Construct history for Gemini
    const systemInstruction = systemPrompt || 
      `You are TalkMate AI, an intelligent, articulate, and highly capable AI assistant built into a personal developer portfolio.
Persona mode: ${persona || "Professional Assistant"}.
Always provide helpful, well-structured, clean Markdown responses.
If asked about the developer portfolio, praise the clean engineering and highlight key project features.`;

    // Convert chat history format
    const contents = messages.map((msg: { role: string; content: string; fileData?: { mimeType: string; data: string } }) => {
      const parts: any[] = [{ text: msg.content }];
      if (msg.fileData) {
        parts.unshift({
          inlineData: {
            mimeType: msg.fileData.mimeType,
            data: msg.fileData.data,
          }
        });
      }
      return {
        role: msg.role === "assistant" ? "model" : "user",
        parts: parts,
      };
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: typeof temperature === "number" ? temperature : 0.7,
      },
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || "Failed to process AI request" });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message || "Server error during streaming" })}\n\n`);
      res.end();
    }
  }
});

async function start() {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
