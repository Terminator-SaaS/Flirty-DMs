import { useState } from "react";

const HEARTS = ["♥", "♡", "❤", "✦", "✧", "~"];

function FloatingHeart({ style }) {
  return <span className="floating-heart" style={style}>♡</span>;
}

export default function FlirtyReplies() {
  const [text, setText] = useState("");
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [hearts, setHearts] = useState([]);

  const spawnHearts = () => {
    const newHearts = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      left: `${10 + Math.random() * 80}%`,
      animationDelay: `${Math.random() * 0.5}s`,
      fontSize: `${12 + Math.random() * 16}px`,
    }));
    setHearts(newHearts);
    setTimeout(() => setHearts([]), 2000);
  };

  const generateReplies = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setReplies([]);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a charming, witty flirt coach. Given a message someone received, generate exactly 3 flirty, playful reply options. 
They should be fun, light-hearted, and clever — not creepy or overly sexual. Think: confident, warm, a little cheeky.
Respond ONLY with a JSON array of exactly 3 strings. No keys, no explanation, no markdown. Example: ["reply one", "reply two", "reply three"]`,
          messages: [{ role: "user", content: `Message I received: "${text}"` }],
        }),
      });

      const data = await response.json();
      const raw = data.content?.find(b => b.type === "text")?.text || "[]";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setReplies(parsed);
      spawnHearts();
    } catch (err) {
      setReplies(["Oops, my charm crashed 😅 Try again!", "", ""]);
    }

    setLoading(false);
  };

  const copyReply = (reply, i) => {
    navigator.clipboard.writeText(reply);
    setCopied(i);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0a0f",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "48px 20px 80px",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400&display=swap');

        * { box-sizing: border-box; }

        .floating-heart {
          position: fixed;
          bottom: 40%;
          color: #e8607a;
          animation: floatUp 1.8s ease-out forwards;
          pointer-events: none;
          z-index: 100;
          opacity: 0.8;
        }

        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0.9; }
          100% { transform: translateY(-300px) scale(0.3); opacity: 0; }
        }

        .glow-border {
          border: 1px solid rgba(232, 96, 122, 0.3);
          border-radius: 16px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .glow-border:focus-within {
          border-color: rgba(232, 96, 122, 0.7);
          box-shadow: 0 0 20px rgba(232, 96, 122, 0.15);
          outline: none;
        }

        textarea {
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          color: #f0e6eb;
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.7;
          width: 100%;
          padding: 20px;
        }
        textarea::placeholder { color: rgba(240, 230, 235, 0.3); }

        .btn-main {
          background: linear-gradient(135deg, #e8607a 0%, #c94b8a 100%);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 14px 40px;
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(232, 96, 122, 0.35);
        }
        .btn-main:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(232, 96, 122, 0.5);
        }
        .btn-main:disabled { opacity: 0.5; cursor: not-allowed; }

        .reply-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(232, 96, 122, 0.18);
          border-radius: 16px;
          padding: 20px 24px;
          position: relative;
          transition: background 0.2s, border-color 0.2s;
          animation: slideIn 0.4s ease-out both;
        }
        .reply-card:hover {
          background: rgba(232, 96, 122, 0.06);
          border-color: rgba(232, 96, 122, 0.4);
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .copy-btn {
          background: rgba(232, 96, 122, 0.12);
          border: 1px solid rgba(232, 96, 122, 0.3);
          color: #e8607a;
          border-radius: 8px;
          padding: 6px 14px;
          font-family: 'Lato', sans-serif;
          font-size: 12px;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 14px;
        }
        .copy-btn:hover { background: rgba(232, 96, 122, 0.25); }

        .shimmer {
          background: linear-gradient(90deg, rgba(232,96,122,0.1) 25%, rgba(232,96,122,0.25) 50%, rgba(232,96,122,0.1) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
          height: 18px;
          margin-bottom: 10px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .tag {
          display: inline-block;
          background: rgba(232,96,122,0.12);
          border: 1px solid rgba(232,96,122,0.25);
          color: #e8607a;
          border-radius: 50px;
          padding: 3px 12px;
          font-size: 11px;
          letter-spacing: 1px;
          font-family: 'Lato', sans-serif;
          font-weight: 400;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
      `}</style>

      {hearts.map(h => (
        <FloatingHeart key={h.id} style={{ left: h.left, animationDelay: h.animationDelay, fontSize: h.fontSize }} />
      ))}

      {/* Ambient glow blobs */}
      <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(201,75,138,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-80px", left: "-80px", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(232,96,122,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div className="tag">✦ AI Flirt Coach ✦</div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(36px, 6vw, 58px)",
          fontWeight: 700,
          color: "#f5e8ee",
          margin: "0 0 12px",
          lineHeight: 1.15,
          letterSpacing: "-0.5px",
        }}>
          Say it with <em style={{ color: "#e8607a" }}>charm.</em>
        </h1>
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontWeight: 300,
          color: "rgba(240, 230, 235, 0.5)",
          fontSize: "15px",
          letterSpacing: "0.3px",
          maxWidth: "360px",
          margin: "0 auto",
        }}>
          Paste a message you received. Get 3 flirty comebacks, instantly.
        </p>
      </div>

      {/* Input card */}
      <div style={{ width: "100%", maxWidth: "580px" }}>
        <div className="glow-border" style={{ marginBottom: "20px", background: "rgba(255,255,255,0.02)" }}>
          <textarea
            rows={5}
            placeholder="Paste the message here… e.g. "You free this weekend?""
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generateReplies(); }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px 14px" }}>
            <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "12px", color: "rgba(240,230,235,0.25)" }}>
              {text.length > 0 ? `${text.length} chars · ⌘↵ to generate` : "⌘↵ to generate"}
            </span>
            <span style={{ fontSize: "18px", opacity: text.length > 0 ? 1 : 0.2 }}>♡</span>
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <button className="btn-main" onClick={generateReplies} disabled={loading || !text.trim()}>
            {loading ? "Crafting replies…" : "✦ Generate Flirty Replies"}
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="reply-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="shimmer" style={{ width: "85%" }} />
                <div className="shimmer" style={{ width: "60%" }} />
              </div>
            ))}
          </div>
        )}

        {/* Replies */}
        {!loading && replies.length > 0 && (
          <div>
            <p style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: "11px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "rgba(232,96,122,0.6)",
              marginBottom: "16px",
              textAlign: "center",
            }}>
              — Pick your move —
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {replies.filter(Boolean).map((reply, i) => (
                <div key={i} className="reply-card" style={{ animationDelay: `${i * 0.12}s` }}>
                  <div style={{
                    position: "absolute",
                    top: "18px",
                    right: "20px",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "22px",
                    color: "rgba(232,96,122,0.2)",
                    fontStyle: "italic",
                  }}>{i + 1}</div>
                  <p style={{
                    color: "#f0e6eb",
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: 300,
                    fontSize: "15px",
                    lineHeight: 1.7,
                    margin: 0,
                    paddingRight: "32px",
                  }}>{reply}</p>
                  <button className="copy-btn" onClick={() => copyReply(reply, i)}>
                    {copied === i ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <p style={{
        position: "fixed",
        bottom: "20px",
        fontFamily: "'Lato', sans-serif",
        fontSize: "12px",
        color: "rgba(240,230,235,0.2)",
        letterSpacing: "0.5px",
      }}>
        Powered by Claude ♡
      </p>
    </div>
  );
}
