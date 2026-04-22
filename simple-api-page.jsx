import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const callAPI = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResponses([]);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a helpful assistant. Given the user's input, provide exactly 3 distinct responses or perspectives. 
Respond ONLY with a JSON array of exactly 3 strings. No keys, no explanation, no markdown fences.
Example: ["response one", "response two", "response three"]`,
          messages: [{ role: "user", content: input }],
        }),
      });

      const data = await res.json();
      const text = data.content?.find((b) => b.type === "text")?.text || "[]";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResponses(parsed);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f4f0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      fontFamily: "'Georgia', serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }

        .card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e8e6e0;
          animation: fadeUp 0.35s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        textarea {
          width: 100%;
          border: 1.5px solid #ddd9d0;
          border-radius: 10px;
          padding: 14px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: #1a1a1a;
          background: #fdfcfa;
          resize: none;
          outline: none;
          transition: border-color 0.2s;
          line-height: 1.6;
        }
        textarea:focus { border-color: #1a1a1a; }
        textarea::placeholder { color: #aaa; }

        button {
          background: #1a1a1a;
          color: #f5f4f0;
          border: none;
          border-radius: 8px;
          padding: 12px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          letter-spacing: 0.3px;
        }
        button:hover:not(:disabled) { opacity: 0.82; transform: translateY(-1px); }
        button:disabled { opacity: 0.4; cursor: not-allowed; }

        .label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 8px;
        }

        .shimmer {
          height: 16px;
          border-radius: 6px;
          background: linear-gradient(90deg, #eee 25%, #e0e0e0 50%, #eee 75%);
          background-size: 200% 100%;
          animation: shimmer 1.2s infinite;
          margin-bottom: 10px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: "560px" }}>
        {/* Title */}
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "32px",
          color: "#1a1a1a",
          margin: "0 0 4px",
          fontWeight: 400,
        }}>
          Ask anything
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: "14px",
          color: "#888",
          margin: "0 0 32px",
        }}>
          Get 3 responses from Claude instantly.
        </p>

        {/* Input area */}
        <div style={{ marginBottom: "16px" }}>
          <div className="label">Your prompt</div>
          <textarea
            rows={4}
            placeholder="Type your question or message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) callAPI(); }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "36px" }}>
          <button onClick={callAPI} disabled={loading || !input.trim()}>
            {loading ? "Generating…" : "Generate →"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#c0392b", marginBottom: "16px" }}>
            {error}
          </p>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="shimmer" style={{ width: "90%" }} />
                <div className="shimmer" style={{ width: "65%" }} />
              </div>
            ))}
          </div>
        )}

        {/* Responses */}
        {!loading && responses.length > 0 && (
          <div>
            <div className="label" style={{ marginBottom: "12px" }}>Responses</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {responses.map((r, i) => (
                <div key={i} className="card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "#bbb",
                    marginBottom: "8px",
                  }}>
                    Option {i + 1}
                  </div>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: "15px",
                    color: "#1a1a1a",
                    lineHeight: 1.65,
                    margin: 0,
                  }}>
                    {r}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
