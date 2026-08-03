import { GoogleGenAI, type Content } from "@google/genai";
import { getClientIp, isRateLimited, methodNotAllowed, type ApiRequest, type ApiResponse } from "./_shared";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4_000;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set(["text/plain", "text/markdown", "application/pdf", "image/jpeg", "image/png", "image/webp"]);
const requestHistory = new Map<string, number[]>();
const PERSONA_PROMPTS: Record<string, string> = {
  "tech-mentor": "You are TalkMate AI acting as a student-focused tech mentor. Explain technical ideas clearly, share practical implementation advice, and help visitors understand how a React frontend and Vercel serverless API work together.",
  "code-reviewer": "You are TalkMate AI acting as a practical code review partner. Identify bugs, awkward logic, and maintainability concerns in small code examples. Offer concise suggestions and clear next steps.",
  "career-mentor": "You are TalkMate AI acting as a learning coach for a student developer. Help users think through project ideas, portfolio choices, and practical ways to improve technical skills through building.",
  "tech-interviewer": "You are TalkMate AI acting as a practice interviewer for web and AI projects. Ask focused questions about React, TypeScript, serverless APIs, debugging, and developer workflows, then give constructive feedback.",
  "ui-designer": "You are TalkMate AI acting as a design partner for student-built web apps. Focus on clear layouts, accessibility, readable interfaces, and approachable styling decisions.",
  "ai-researcher": "You are TalkMate AI acting as an AI explorer for a student portfolio project. Explain LLMs, prompt design, streaming responses, and multimodal experiences in a simple way.",
  "friendly-companion": "You are TalkMate AI, a friendly student-focused assistant. Respond warmly, explain ideas simply, and encourage curiosity and steady progress.",
};
type FileData = { mimeType: string; data: string };
type ChatMessage = { role: "user" | "assistant"; content: string; fileData?: FileData };
type ChatPayload = { messages?: unknown; personaId?: unknown };
let aiClient: GoogleGenAI | undefined;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is missing.");
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}
function isValidFileData(fileData: unknown): fileData is FileData {
  if (!fileData || typeof fileData !== "object") return false;
  const { mimeType, data } = fileData as Partial<FileData>;
  return typeof mimeType === "string" && ALLOWED_FILE_TYPES.has(mimeType) && typeof data === "string"
    && /^[A-Za-z0-9+/]+={0,2}$/.test(data) && Buffer.byteLength(data, "base64") <= MAX_FILE_SIZE_BYTES;
}
function isValidMessage(message: unknown): message is ChatMessage {
  if (!message || typeof message !== "object") return false;
  const value = message as Partial<ChatMessage>;
  return (value.role === "user" || value.role === "assistant") && typeof value.content === "string"
    && value.content.length <= MAX_MESSAGE_LENGTH && (value.fileData === undefined || isValidFileData(value.fileData));
}
function toGeminiContents(messages: ChatMessage[]): Content[] {
  return messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [...(message.fileData ? [{ inlineData: message.fileData }] : []), { text: message.content }],
  }));
}

export default async function handler(request: ApiRequest, response: ApiResponse): Promise<void> {
  if (request.method !== "POST") return methodNotAllowed(response);
  const { messages, personaId } = (request.body ?? {}) as ChatPayload;
  if (!Array.isArray(messages)) { response.status(400).json({ error: "Invalid messages format" }); return; }
  if (messages.length === 0 || messages.length > MAX_MESSAGES) { response.status(400).json({ error: `Send between 1 and ${MAX_MESSAGES} messages.` }); return; }
  if (typeof personaId !== "string" || !PERSONA_PROMPTS[personaId]) { response.status(400).json({ error: "Invalid persona." }); return; }
  if (!messages.every(isValidMessage)) { response.status(400).json({ error: `Each message and attachment must be valid; text is limited to ${MAX_MESSAGE_LENGTH} characters.` }); return; }
  if (isRateLimited(requestHistory, getClientIp(request), WINDOW_MS, MAX_REQUESTS)) { response.status(429).json({ error: "Too many chat requests. Please wait a few minutes and try again." }); return; }
  try {
    const stream = await getGeminiClient().models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: toGeminiContents(messages),
      config: { systemInstruction: `${PERSONA_PROMPTS[personaId]}\nAlways provide helpful, well-structured Markdown responses. TalkMate is a personal AI project, so acknowledge that responses may occasionally be inaccurate when relevant.`, temperature: 0.7 },
    });
    response.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    response.setHeader("Cache-Control", "no-cache, no-transform");
    response.setHeader("Connection", "keep-alive");
    response.setHeader("X-Accel-Buffering", "no");
    for await (const chunk of stream) if (chunk.text) response.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
    response.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    response.end();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process AI request";
    console.error("Chat request failed:", error);
    if (response.headersSent) { response.write(`data: ${JSON.stringify({ error: message })}\n\n`); response.end(); return; }
    response.status(500).json({ error: message });
  }
}
