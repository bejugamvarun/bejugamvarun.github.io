import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// History format Gemini expects
interface GeminiTurn {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const SYSTEM_PROMPT = `You are an AI assistant embedded in Varun Kumar Bejugam's personal portfolio.

About Varun:
- Software Engineer & AI/ML Researcher at Goldman Sachs
- Builds multi-agent LLM systems, regulatory analytics platforms, and cloud infrastructure
- Interests: AI/ML, quantum field theory, particle physics, finance, distributed systems
- Stack: Python, PyTorch, AWS Bedrock, AgentCore, LangChain, Google ADK, Spring Boot, Kafka

His writing lives at the "stdout" section — a blog where he posts curiosities across physics, AI, and engineering. Current posts:
- "The Equation That Explains Everything" — A deep dive into the Standard Model Lagrangian, quantum field theory, and the limits of our best theory
- "Agentic Financial Metrics" — How multi-agent LLM systems are reshaping financial analytics at scale

Your purpose:
1. Answer questions about Varun's background, projects, skills, and writing topics
2. When visitors ask about physics, AI/ML, finance, or engineering — give a genuine answer and point them to the stdout section (/blog) to read more
3. Use Google Search to give accurate, up-to-date context when needed
4. Be concise and direct. No filler phrases. No "Great question!" openers. Just answer.
5. For contact enquiries, direct to the /contact page.

Tone: Knowledgeable, terse, a little nerdy. Like talking to a senior engineer who reads physics papers for fun.`;

const WELCOME = `portfolio_agent v1.0 — Gemini + Google Search
──────────────────────────────────────────
Ask me about Varun's work, physics, AI/ML,
or anything from stdout.`;

const SUGGESTIONS = [
  'What is the Standard Model?',
  "What does Varun do at Goldman Sachs?",
  "What's on the stdout blog?",
  'How do multi-agent LLM systems work?',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [geminiHistory, setGeminiHistory] = useState<GeminiTurn[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      if (!apiKey) throw new Error('API key not configured');

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        tools: [{ googleSearch: {} }] as any,
        systemInstruction: SYSTEM_PROMPT,
      });

      const chat = model.startChat({ history: geminiHistory });
      const result = await chat.sendMessage(trimmed);
      const responseText = result.response.text();

      // Append to Gemini history for next turn
      setGeminiHistory((prev) => [
        ...prev,
        { role: 'user', parts: [{ text: trimmed }] },
        { role: 'model', parts: [{ text: responseText }] },
      ]);

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: responseText },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `error: ${err?.message ?? 'something went wrong'}` },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, geminiHistory]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') send(input);
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close agent' : 'Open agent'}
        style={{
          position: 'fixed',
          bottom: '1.75rem',
          right: '1.75rem',
          zIndex: 200,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: open ? 'var(--surface-2)' : 'var(--amber)',
          border: open ? '1px solid var(--amber)' : 'none',
          color: open ? 'var(--amber)' : '#000',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: open
            ? '0 0 0 1px var(--amber)'
            : '0 4px 24px rgba(240,180,41,0.4)',
          transition: 'all 0.2s',
        }}
      >
        {open ? '✕' : '>_'}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '5.5rem',
            right: '1.75rem',
            zIndex: 199,
            width: 'min(420px, calc(100vw - 2rem))',
            height: 'min(560px, calc(100vh - 8rem))',
            background: 'var(--surface)',
            border: '1px solid var(--border-bright)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(240,180,41,0.06)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '0.75rem 1rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--green)',
                animation: 'pulse-dot 2.2s infinite',
                display: 'inline-block',
              }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              portfolio_agent
            </span>
            <span
              style={{
                marginLeft: 'auto',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: 'var(--amber)',
                background: 'var(--amber-10)',
                padding: '0.15rem 0.5rem',
                borderRadius: 4,
                border: '1px solid rgba(240,180,41,0.2)',
              }}
            >
              Gemini · Google Search
            </span>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {/* Welcome */}
            <pre
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.63rem',
                color: 'var(--text-dim)',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {WELCOME}
            </pre>

            {/* Suggestion chips — hidden after first message */}
            {messages.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      padding: '0.4rem 0.65rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      color: 'var(--text-muted)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s, color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = 'var(--amber)';
                      el.style.color = 'var(--amber)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = 'var(--border)';
                      el.style.color = 'var(--text-muted)';
                    }}
                  >
                    › {s}
                  </button>
                ))}
              </div>
            )}

            {/* Conversation */}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: msg.role === 'user' ? 'var(--amber)' : 'var(--green)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {msg.role === 'user' ? '$ you' : '> agent'}
                </span>
                <p
                  style={{
                    fontFamily: msg.role === 'assistant' ? 'var(--font-body)' : 'var(--font-mono)',
                    fontSize: '0.82rem',
                    color: msg.content.startsWith('error:') ? '#ff6b6b' : 'var(--text)',
                    lineHeight: 1.65,
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.content}
                </p>
              </div>
            ))}

            {/* Thinking indicator */}
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--green)', letterSpacing: '0.05em' }}>
                  {'>'} agent
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                  thinking<span style={{ animation: 'blink 1s step-end infinite' }}>_</span>
                </span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div
            style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--amber)', flexShrink: 0 }}>
              $
            </span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="ask anything..."
              disabled={loading}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: 'var(--text)',
                caretColor: 'var(--amber)',
              }}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              style={{
                background: 'none',
                border: 'none',
                color: input.trim() && !loading ? 'var(--amber)' : 'var(--text-dim)',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                padding: '0.1rem 0.3rem',
                transition: 'color 0.15s',
                flexShrink: 0,
              }}
            >
              ↵
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </>
  );
}
