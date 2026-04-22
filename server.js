import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Anthropic client ──────────────────────────────────────────────────────────
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ── Routes ────────────────────────────────────────────────────────────────────

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * POST /api/generate
 * Body: { prompt: string, count?: number }
 * Returns: { responses: string[] }
 */
app.post("/api/generate", async (req, res) => {
  const { prompt, count = 3 } = req.body;

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "prompt is required and must be a non-empty string." });
  }

  const n = Math.min(Math.max(parseInt(count) || 3, 1), 5); // clamp between 1–5

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      system: `You are a helpful assistant. Given the user's input, provide exactly ${n} distinct, high-quality responses or perspectives.
Respond ONLY with a valid JSON array of exactly ${n} strings.
No keys, no explanation, no markdown fences — just the raw JSON array.
Example: ["response one", "response two", "response three"]`,
      messages: [{ role: "user", content: prompt.trim() }],
    });

    const raw = message.content.find((b) => b.type === "text")?.text ?? "[]";
    const responses = JSON.parse(raw);

    if (!Array.isArray(responses)) {
      throw new Error("Model did not return an array.");
    }

    return res.json({ responses });
  } catch (err) {
    console.error("[/api/generate]", err.message);

    // Surface Anthropic API errors with their status code when available
    const status = err.status ?? 500;
    return res.status(status).json({ error: err.message ?? "Internal server error." });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
