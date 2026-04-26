import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GeminiTurn {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface ModelOption {
  id: string;
  label: string;
  search: boolean;
}

const MODELS: ModelOption[] = [
  { id: 'gemma-4-31b-it',        label: 'Gemma 4 31B',         search: false },
  { id: 'gemini-2.0-flash-lite', label: 'Gemini Flash Lite',   search: true  },
];

const buildSystemPrompt = (search: boolean) => `\
You are a concise AI assistant embedded in Varun Kumar Bejugam's portfolio website.

IMPORTANT RULES:
- Output ONLY the final answer. Never show bullet-point reasoning, "Context:", "Goal:", "Constraint check:", draft steps, or internal notes.
- Keep responses short and sharp — 2–5 sentences max unless a detailed list is genuinely needed.
- No filler phrases ("Great question!", "Sure!", "Of course!"). Just answer.
- When relevant, include direct links from the site (e.g. /blog, /experience, /contact, /projects, /resume).
- Format links as markdown: [text](url)
- Tone: knowledgeable, terse, a little nerdy. Like a senior engineer who reads physics papers for fun.
${search ? '- You have Google Search — use it for current facts, but keep the answer tight.' : ''}

━━━ ABOUT VARUN ━━━
Name: Varun Kumar Bejugam
Email: bejugamvarun@gmail.com
LinkedIn: https://linkedin.com/in/bejugamvarun
GitHub: https://github.com/bejugamvarun
Twitter/X: https://x.com/bejugamvarun
HuggingFace: https://huggingface.co/bejugamvarun

━━━ CURRENT ROLE ━━━
Associate Software Engineer (SDE2) at Goldman Sachs — Liquidity Risk Applications (Aug 2025 – Present)
- Architecting regulatory compliance platforms for FR2052a and Federal Reserve liquidity risk metrics
- Leading cloud migration to AWS (ECS, Fargate, ECR, S3, MWAA)
- Engineering Apache Airflow DAGs for end-to-end risk calculation workflows
- Building a multi-agent LLM GenAI platform (AWS Bedrock, SageMaker, AgentCore, LangChain, Google ADK) for automated regulatory report generation
- Fine-tuning LLMs on financial risk domain data with agentic orchestration

━━━ PAST EXPERIENCE ━━━
WissenIT — Software Engineer Intern, Healthcare Technology (Feb 2025 – Aug 2025)
- Spring Boot microservices for patient medical records; HIPAA-compliant RESTful APIs; React frontend; Docker + Kubernetes

NCRVoyix — Software Engineer II, Internet Banking Platform (Apr 2023 – Aug 2023)
- 25+ microservices for 400+ credit unions, 5M+ daily transactions
- LLM-powered Virtual Banking Assistant fine-tuned on customer financial data
- Java Spring WebFlux with Netty, 99.99% uptime, 40% latency reduction
- Redis + PostgreSQL caching, 35% response time improvement

NCRVoyix — Software Engineer I, Internet Banking Platform (Aug 2021 – Apr 2023)
- Central Auth & Config Service with JWT; adapter microservices for Fiserv, Zelle; Apache Kafka event-driven architecture

NCRVoyix — Software Engineer Intern, Cloud & Data Engineering (Feb 2021 – Aug 2021)
- Batch job automation for credit card rewards using GCP Scheduler, Apache Beam, DataFlow, Dataproc

Virtusa — Software Engineer Intern, IoT & ML (Jun 2020 – Nov 2020)
- ML-powered IoT automation system handling 1,000+ daily interactions, 40% less manual intervention

━━━ EDUCATION ━━━
MS Computer Science — UNC Charlotte (Aug 2023 – Dec 2024), GPA 3.90/4.00
  Coursework: Software Engineering · Cloud Computing · Intelligent Systems · Machine Learning · Advanced Database Management · Full-Stack Development

BTech Computer Science — JNTU (Jun 2017 – Jul 2021), GPA 8.2/10.00
  Coursework: Data Structures · Algorithms · Networking · OOP with Java · Software System Design Patterns

━━━ SKILLS ━━━
AI/ML: PyTorch, TensorFlow, LangChain, AWS Bedrock, SageMaker, AgentCore, Google ADK, LLM Fine-tuning, Multi-Agent Systems, Transformers
Languages: Python, Java, Kotlin, TypeScript, JavaScript, Golang, Bash
Cloud & DevOps: AWS ECS/Fargate, Docker, Kubernetes, Apache Airflow, Apache Kafka, Helm, ArgoCD, Terraform, GCP
Backend & Data: Spring Boot, Spring WebFlux, React, Node.js, PostgreSQL, Redis, MongoDB, Snowflake

━━━ SITE PAGES ━━━
/ → Home — overview, skills, recent posts
/experience → Full career timeline and education
/projects → Side projects and work at Goldman Sachs
/blog → stdout — writing on AI, physics, engineering
/resume → Curriculum Vitae (PDF download available)
/contact → Get in touch

━━━ STDOUT BLOG POSTS ━━━
"The Equation That Explains Everything (And The Things It Doesn't)" → /blog/standard-model-physics
  Deep dive into the Standard Model Lagrangian, quantum field theory, all 12 particles and 3 forces, the Higgs mechanism, dark matter, gravity — and why the model is almost certainly incomplete.

"Agentic Financial Metrics" → /blog/agentic-financial-metrics
  How multi-agent LLM systems are reshaping financial analytics and regulatory reporting at scale.

━━━ CONTACT ━━━
Direct visitors to /contact for any hiring, collaboration, or general enquiries.`;

const WELCOME = `portfolio_agent v1.0
────────────────────────────────────
Ask me about Varun's work, physics,
AI/ML, or anything from stdout.`;

const SUGGESTIONS = [
  'What is the Standard Model?',
  'What does Varun do at Goldman Sachs?',
  "What's on the stdout blog?",
  'How do multi-agent LLM systems work?',
];

// Render text with clickable markdown links [text](url)
function renderContent(text: string) {
  const parts = text.split(/(\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]*)\))/g);
  const result: React.ReactNode[] = [];
  let i = 0;
  while (i < parts.length) {
    const part = parts[i];
    if (/^\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]*)\)$/.test(part)) {
      const labelMatch = part.match(/^\[([^\]]+)\]/);
      const urlMatch = part.match(/\]\(([^)]+)\)$/);
      if (labelMatch && urlMatch) {
        const url = urlMatch[1];
        const isExternal = url.startsWith('http');
        result.push(
          <a
            key={i}
            href={url}
            target={isExternal ? '_blank' : '_self'}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            style={{ color: 'var(--amber)', textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            {labelMatch[1]}
          </a>
        );
      }
    } else if (part && !/^\[([^\]]+)\]$/.test(part) && !/^\(https?:\/\/[^)]+\)$/.test(part) && !/^\/[^)]*\)$/.test(part)) {
      result.push(<span key={i}>{part}</span>);
    }
    i++;
  }
  return result;
}

export default function ChatWidget() {
  const [open, setOpen]               = useState(false);
  const [messages, setMessages]       = useState<Message[]>([]);
  const [geminiHistory, setGeminiHistory] = useState<GeminiTurn[]>([]);
  const [input, setInput]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [modelIdx, setModelIdx]       = useState(0);
  const [showModels, setShowModels]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  const selectedModel = MODELS[modelIdx];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // Reset history when model changes
  const switchModel = (idx: number) => {
    setModelIdx(idx);
    setShowModels(false);
    setMessages([]);
    setGeminiHistory([]);
  };

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      if (!apiKey) throw new Error('API key not configured');

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: selectedModel.id,
        systemInstruction: buildSystemPrompt(selectedModel.search),
        ...(selectedModel.search ? { tools: [{ googleSearch: {} }] as any } : {}),
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          // Disable thinking output for Gemma 4 / thinking models
          ...(selectedModel.id.startsWith('gemma-4') ? { thinkingConfig: { thinkingBudget: 0 } } as any : {}),
        },
      });

      const chat = model.startChat({ history: geminiHistory });
      const result = await chat.sendMessage(trimmed);

      // Extract only non-thought parts (Gemma 4 thinking models emit thought parts separately)
      const candidate = result.response.candidates?.[0];
      const responseText = candidate?.content?.parts
        ?.filter((p: any) => !p.thought && p.text)
        .map((p: any) => p.text as string)
        .join('') ?? result.response.text();

      setGeminiHistory(prev => [
        ...prev,
        { role: 'user',  parts: [{ text: trimmed }] },
        { role: 'model', parts: [{ text: responseText }] },
      ]);

      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `error: ${err?.message ?? 'something went wrong'}` }]);
    } finally {
      setLoading(false);
    }
  }, [loading, geminiHistory, selectedModel]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') send(input);
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close agent' : 'Open agent'}
        style={{
          position: 'fixed', bottom: '1.75rem', right: '1.75rem', zIndex: 200,
          width: 52, height: 52, borderRadius: '50%',
          background: open ? 'var(--surface-2)' : 'var(--amber)',
          border: open ? '1px solid var(--amber)' : 'none',
          color: open ? 'var(--amber)' : '#000',
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: open ? '0 0 0 1px var(--amber)' : '0 4px 24px rgba(240,180,41,0.4)',
          transition: 'all 0.2s',
        }}
      >
        {open ? '✕' : '>_'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '5.5rem', right: '1.75rem', zIndex: 199,
          width: 'min(420px, calc(100vw - 2rem))',
          height: 'min(560px, calc(100vh - 8rem))',
          background: 'var(--surface)', border: '1px solid var(--border-bright)',
          borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(240,180,41,0.06)',
        }}>

          {/* Header */}
          <div style={{
            padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: 'var(--green)',
              animation: 'pulse-dot 2.2s infinite', display: 'inline-block',
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              portfolio_agent
            </span>

            {/* Model selector */}
            <div style={{ marginLeft: 'auto', position: 'relative' }}>
              <button
                onClick={() => setShowModels(s => !s)}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--amber)',
                  background: 'var(--amber-10)', padding: '0.15rem 0.5rem', borderRadius: 4,
                  border: '1px solid rgba(240,180,41,0.2)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                }}
              >
                {selectedModel.label} {selectedModel.search ? '· Search' : ''} ▾
              </button>
              {showModels && (
                <div style={{
                  position: 'absolute', top: '110%', right: 0, zIndex: 10,
                  background: 'var(--surface-2)', border: '1px solid var(--border-bright)',
                  borderRadius: 8, overflow: 'hidden', minWidth: 180,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}>
                  {MODELS.map((m, idx) => (
                    <button
                      key={m.id}
                      onClick={() => switchModel(idx)}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '0.55rem 0.85rem',
                        fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                        color: idx === modelIdx ? 'var(--amber)' : 'var(--text-muted)',
                        background: idx === modelIdx ? 'var(--amber-10)' : 'transparent',
                        border: 'none', cursor: 'pointer',
                        borderBottom: idx < MODELS.length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      {m.label}{m.search ? ' · Search' : ''}
                      {idx === modelIdx && ' ✓'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '1rem',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
          }}>
            <pre style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: 'var(--text-dim)',
              whiteSpace: 'pre-wrap', lineHeight: 1.65, margin: 0,
            }}>
              {WELCOME}
            </pre>

            {/* Suggestion chips */}
            {messages.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)} style={{
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: 6, padding: '0.4rem 0.65rem',
                    fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                    color: 'var(--text-muted)', textAlign: 'left', cursor: 'pointer',
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--amber)'; el.style.color = 'var(--amber)'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-muted)'; }}
                  >
                    › {s}
                  </button>
                ))}
              </div>
            )}

            {/* Conversation */}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                  color: msg.role === 'user' ? 'var(--amber)' : 'var(--green)',
                  letterSpacing: '0.05em',
                }}>
                  {msg.role === 'user' ? '$ you' : '> agent'}
                </span>
                <p style={{
                  fontFamily: msg.role === 'assistant' ? 'var(--font-body)' : 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: msg.content.startsWith('error:') ? '#ff6b6b' : 'var(--text)',
                  lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap',
                }}>
                  {msg.role === 'assistant' ? renderContent(msg.content) : msg.content}
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

          {/* Input */}
          <div style={{
            padding: '0.75rem 1rem', borderTop: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--amber)', flexShrink: 0 }}>$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="ask anything..."
              disabled={loading}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
                color: 'var(--text)', caretColor: 'var(--amber)',
              }}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              style={{
                background: 'none', border: 'none',
                color: input.trim() && !loading ? 'var(--amber)' : 'var(--text-dim)',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                fontFamily: 'var(--font-mono)', fontSize: '0.9rem',
                padding: '0.1rem 0.3rem', transition: 'color 0.15s', flexShrink: 0,
              }}
            >
              ↵
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </>
  );
}
