import { useEffect, useRef, useState, KeyboardEvent } from 'react';

type LineType = 'cmd' | 'output' | 'info' | 'error' | 'success' | 'blank';

interface TermLine {
  type: LineType;
  text: string;
}

/* ── Intro animation lines ────────────────────────────── */
const INTRO: TermLine[] = [
  { type: 'cmd', text: '$ whoami' },
  { type: 'output', text: 'varun-kumar-bejugam' },
  { type: 'blank', text: '' },
  { type: 'cmd', text: '$ cat profile.json' },
  { type: 'output', text: '{' },
  { type: 'output', text: '  "role": "Associate SDE2 — Liquidity Risk",' },
  { type: 'output', text: '  "company": "Goldman Sachs",' },
  { type: 'output', text: '  "focus": ["Multi-Agent LLMs", "AWS Bedrock", "FinTech AI"],' },
  { type: 'output', text: '  "status": "building regulatory AI at scale"' },
  { type: 'output', text: '}' },
  { type: 'blank', text: '' },
  { type: 'info', text: '✦ interactive · type "help" to explore' },
];

/* ── Command registry ─────────────────────────────────── */
const URLS: Record<string, string> = {
  github: 'https://github.com/bejugamvarun',
  linkedin: 'https://linkedin.com/in/bejugamvarun',
  huggingface: 'https://huggingface.co/bejugamvarun',
  hf: 'https://huggingface.co/bejugamvarun',
  twitter: 'https://x.com/bejugamvarun',
  x: 'https://x.com/bejugamvarun',
  leetcode: 'https://leetcode.com/u/varun0603/',
};

const AUTOCOMPLETE = [
  'help', 'whoami', 'cat about.txt', 'cat profile.json',
  'ls', 'ls projects/', 'ls skills/', 'ls posts/',
  'contact', 'open github', 'open linkedin', 'open huggingface',
  'clear', 'date', 'pwd', 'history', 'hack', 'matrix',
];

function runCommand(raw: string): { lines: TermLine[]; action?: () => void; clear?: boolean } {
  const parts = raw.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1).map((a) => a.toLowerCase());

  if (!cmd) return { lines: [] };

  switch (cmd) {
    case 'help':
    case '?':
      return {
        lines: [
          { type: 'info',   text: '┌─ Commands ────────────────────────────────────┐' },
          { type: 'output', text: '│  whoami           who is varun?               │' },
          { type: 'output', text: '│  cat about.txt    full bio                    │' },
          { type: 'output', text: '│  cat profile.json full profile                │' },
          { type: 'output', text: '│  ls               list directory              │' },
          { type: 'output', text: '│  ls projects/     all projects                │' },
          { type: 'output', text: '│  ls skills/       tech stack                  │' },
          { type: 'output', text: '│  ls posts/        blog posts                  │' },
          { type: 'output', text: '│  contact          contact info                │' },
          { type: 'output', text: '│  open <site>      github · linkedin · hf · x  │' },
          { type: 'output', text: '│  date             current date/time           │' },
          { type: 'output', text: '│  pwd              current path                │' },
          { type: 'output', text: '│  history          command history             │' },
          { type: 'output', text: '│  echo <text>      repeat text                 │' },
          { type: 'output', text: '│  clear            clear terminal              │' },
          { type: 'info',   text: '└───────────────────────────────────────────────┘' },
          { type: 'blank',  text: '' },
          { type: 'info',   text: 'tip: ↑↓ for history · tab to autocomplete' },
        ],
      };

    case 'whoami':
      return {
        lines: [
          { type: 'success', text: 'Varun Kumar Bejugam' },
          { type: 'output',  text: 'Associate SDE2 · Liquidity Risk Applications' },
          { type: 'output',  text: 'Goldman Sachs — regulatory AI & cloud infrastructure' },
          { type: 'blank',   text: '' },
          { type: 'info',    text: 'try: cat about.txt' },
        ],
      };

    case 'cat':
      if (!args[0]) return { lines: [{ type: 'error', text: 'usage: cat <filename>' }] };

      if (args[0] === 'about.txt' || args[0] === 'about') {
        return {
          lines: [
            { type: 'blank',  text: '' },
            { type: 'output', text: 'SDE2 at Goldman Sachs — Liquidity Risk Applications.' },
            { type: 'blank',  text: '' },
            { type: 'output', text: 'Building multi-agent GenAI systems that automate' },
            { type: 'output', text: 'Federal Reserve regulatory reporting. Leading AWS' },
            { type: 'output', text: 'cloud migration with ECS, Fargate, and Airflow.' },
            { type: 'blank',  text: '' },
            { type: 'output', text: '5+ years across fintech, healthcare, and banking.' },
            { type: 'output', text: 'MS CS from UNC Charlotte (GPA 3.90).' },
            { type: 'blank',  text: '' },
          ],
        };
      }

      if (args[0] === 'profile.json') {
        return {
          lines: [
            { type: 'output', text: '{' },
            { type: 'output', text: '  "name": "Varun Kumar Bejugam",' },
            { type: 'output', text: '  "role": "Associate SDE2",' },
            { type: 'output', text: '  "company": "Goldman Sachs",' },
            { type: 'output', text: '  "dept": "Liquidity Risk Applications",' },
            { type: 'output', text: '  "email": "bejugamvarun@gmail.com",' },
            { type: 'output', text: '  "focus": ["Multi-Agent LLMs", "AWS Bedrock", "Airflow"]' },
            { type: 'output', text: '}' },
          ],
        };
      }

      if (args[0] === 'resume.pdf') {
        return {
          lines: [
            { type: 'info',   text: 'opening /resume...' },
          ],
          action: () => { window.location.href = '/resume'; },
        };
      }

      return { lines: [{ type: 'error', text: `cat: ${args[0]}: no such file` }] };

    case 'ls': {
      const target = args[0];
      if (!target || target === '-la' || target === '-l' || target === '-a') {
        return {
          lines: [
            { type: 'info',   text: 'drwxr-xr-x  projects/' },
            { type: 'info',   text: 'drwxr-xr-x  skills/' },
            { type: 'info',   text: 'drwxr-xr-x  posts/' },
            { type: 'info',   text: '-rw-r--r--  about.txt' },
            { type: 'info',   text: '-rw-r--r--  profile.json' },
            { type: 'info',   text: '-rw-r--r--  resume.pdf' },
          ],
        };
      }
      if (target === 'projects/' || target === 'projects') {
        return {
          lines: [
            { type: 'blank',   text: '' },
            { type: 'success', text: '▸ genai-regulatory-analytics/  [GS · NDA]' },
            { type: 'output',  text: '  Multi-agent LLMs · AWS Bedrock · AgentCore · In Progress' },
            { type: 'blank',   text: '' },
            { type: 'success', text: '▸ liquidity-risk-platform/     [GS · NDA]' },
            { type: 'output',  text: '  AWS ECS/Fargate · Apache Airflow · FR2052a · In Progress' },
            { type: 'blank',   text: '' },
            { type: 'success', text: '▸ txn-analytics/' },
            { type: 'output',  text: '  Apache Kafka · React · Fraud Detection · Python' },
            { type: 'blank',   text: '' },
            { type: 'success', text: '▸ credit-risk-assessment/' },
            { type: 'output',  text: '  TensorFlow · Scikit-learn · ML · FinTech' },
            { type: 'blank',   text: '' },
            { type: 'info',    text: 'full details → /projects' },
          ],
        };
      }
      if (target === 'skills/' || target === 'skills') {
        return {
          lines: [
            { type: 'blank',  text: '' },
            { type: 'info',   text: 'AI/ML      PyTorch · LangChain · AWS Bedrock · AgentCore · Google ADK' },
            { type: 'info',   text: 'Languages  Python · Java · Kotlin · TypeScript · Golang' },
            { type: 'info',   text: 'Cloud      AWS ECS/Fargate · Kubernetes · Airflow · Kafka · Terraform' },
            { type: 'info',   text: 'Backend    Spring Boot · Spring WebFlux · React · PostgreSQL · Redis' },
            { type: 'blank',  text: '' },
          ],
        };
      }
      if (target === 'posts/' || target === 'posts') {
        return {
          lines: [
            { type: 'blank',  text: '' },
            { type: 'output', text: '01  Why I\'m Betting on LangChain for Production AI' },
            { type: 'output', text: '02  ControlNet and the Geometry of Human Motion' },
            { type: 'output', text: '03  Agentic Workflows for Financial Metric Analysis' },
            { type: 'blank',  text: '' },
            { type: 'info',   text: 'read them → /blog' },
          ],
        };
      }
      return { lines: [{ type: 'error', text: `ls: ${target}: no such directory` }] };
    }

    case 'contact':
      return {
        lines: [
          { type: 'blank',   text: '' },
          { type: 'success', text: 'email      bejugamvarun@gmail.com' },
          { type: 'output',  text: 'linkedin   /in/bejugamvarun' },
          { type: 'output',  text: 'github     bejugamvarun' },
          { type: 'output',  text: 'x/twitter  @bejugamvarun' },
          { type: 'output',  text: 'hf         bejugamvarun' },
          { type: 'blank',   text: '' },
          { type: 'info',    text: 'or: open linkedin · open github' },
        ],
      };

    case 'open': {
      if (!args[0]) {
        return { lines: [{ type: 'error', text: 'usage: open <github|linkedin|huggingface|x|leetcode>' }] };
      }
      const url = URLS[args[0]];
      if (url) {
        return {
          lines: [{ type: 'success', text: `opening ${url} ...` }],
          action: () => window.open(url, '_blank', 'noopener noreferrer'),
        };
      }
      return {
        lines: [
          { type: 'error', text: `unknown: "${args[0]}"` },
          { type: 'info',  text: 'available: github · linkedin · huggingface · x · leetcode' },
        ],
      };
    }

    case 'date':
      return { lines: [{ type: 'output', text: new Date().toLocaleString() }] };

    case 'pwd':
      return { lines: [{ type: 'output', text: '~/portfolio/varun-kumar-bejugam' }] };

    case 'echo':
      return { lines: [{ type: 'output', text: parts.slice(1).join(' ') }] };

    case 'clear':
      return { lines: [], clear: true };

    case 'history':
      return { lines: [] }; // handled in component

    case 'sudo':
    case 'su':
      return { lines: [{ type: 'error', text: 'Permission denied. nice try.' }] };

    case 'rm':
      return { lines: [{ type: 'error', text: "can't delete me that easily." }] };

    case 'hack':
      return {
        lines: [
          { type: 'success', text: 'initiating hack sequence...' },
          { type: 'output',  text: '> accessing mainframe ..... ✓' },
          { type: 'output',  text: '> bypassing firewall ....... ✓' },
          { type: 'output',  text: '> downloading internet ..... ✓' },
          { type: 'blank',   text: '' },
          { type: 'success', text: 'just kidding. i build, not break.' },
        ],
      };

    case 'matrix':
      return {
        lines: [
          { type: 'success', text: 'wake up, neo...' },
          { type: 'output',  text: 'the matrix has you.' },
          { type: 'output',  text: 'follow the white rabbit.' },
          { type: 'blank',   text: '' },
          { type: 'info',    text: '(try "hack" next)' },
        ],
      };

    default:
      return {
        lines: [
          { type: 'error', text: `command not found: ${cmd}` },
          { type: 'info',  text: 'type "help" for available commands' },
        ],
      };
  }
}

/* ── Component ────────────────────────────────────────── */

const lineColor = (t: LineType) => {
  switch (t) {
    case 'cmd':     return 'var(--amber)';
    case 'success': return 'var(--green)';
    case 'error':   return '#FF6B6B';
    case 'info':    return 'var(--cyan)';
    default:        return 'var(--text-muted)';
  }
};

const InteractiveTerminal: React.FC = () => {
  const [introIdx, setIntroIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const [lines, setLines] = useState<TermLine[]>([]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef  = useRef<HTMLDivElement>(null);

  /* Intro typewriter */
  useEffect(() => {
    if (introIdx < INTRO.length) {
      const delay = introIdx === 0 ? 300 : 100;
      const t = setTimeout(() => {
        setLines((prev) => [...prev, INTRO[introIdx]]);
        setIntroIdx((i) => i + 1);
      }, delay);
      return () => clearTimeout(t);
    } else {
      setReady(true);
    }
  }, [introIdx]);

  /* Auto-scroll */
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines, input]);

  /* Focus input on click */
  const focusInput = () => {
    if (ready) inputRef.current?.focus();
  };

  const execute = (raw: string) => {
    const trimmed = raw.trim();

    if (!trimmed) return;

    /* history command — handled specially */
    if (trimmed.toLowerCase() === 'history') {
      const histLines: TermLine[] = [
        { type: 'cmd', text: `$ ${trimmed}` },
        ...cmdHistory.map((c, i) => ({
          type: 'output' as LineType,
          text: `  ${String(i + 1).padStart(3, ' ')}  ${c}`,
        })),
      ];
      setLines((prev) => [...prev, ...histLines]);
      setCmdHistory((prev) => [...prev, trimmed]);
      setHistIdx(-1);
      setInput('');
      return;
    }

    const result = runCommand(trimmed);

    if (result.clear) {
      setLines([]);
      setInput('');
      setHistIdx(-1);
      setCmdHistory((prev) => [...prev, trimmed]);
      return;
    }

    setLines((prev) => [
      ...prev,
      { type: 'cmd', text: `$ ${trimmed}` },
      ...result.lines,
    ]);

    if (result.action) setTimeout(result.action, 300);

    setCmdHistory((prev) => [...prev, trimmed]);
    setHistIdx(-1);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        execute(input);
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (cmdHistory.length === 0) break;
        {
          const next = Math.min(histIdx + 1, cmdHistory.length - 1);
          setHistIdx(next);
          setInput(cmdHistory[cmdHistory.length - 1 - next]);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        {
          const next = histIdx - 1;
          if (next < 0) {
            setHistIdx(-1);
            setInput('');
          } else {
            setHistIdx(next);
            setInput(cmdHistory[cmdHistory.length - 1 - next]);
          }
        }
        break;

      case 'Tab':
        e.preventDefault();
        {
          const match = AUTOCOMPLETE.find(
            (c) => c.startsWith(input) && c !== input,
          );
          if (match) setInput(match);
        }
        break;

      case 'l':
        if (e.ctrlKey) { e.preventDefault(); setLines([]); }
        break;

      default:
        break;
    }
  };

  return (
    <div
      className="terminal"
      onClick={focusInput}
      style={{ cursor: ready ? 'text' : 'default', userSelect: 'none' }}
    >
      {/* Title bar */}
      <div className="terminal-bar">
        <span className="terminal-dot" style={{ background: '#FF5F57' }} />
        <span className="terminal-dot" style={{ background: '#FEBC2E' }} />
        <span className="terminal-dot" style={{ background: '#28C840' }} />
        <span
          style={{
            marginLeft: '0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
          }}
        >
          varun@ai — portfolio
        </span>
        {ready && (
          <span
            style={{
              marginLeft: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: 'var(--green)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--green)',
                display: 'inline-block',
                animation: 'pulse-dot 2s infinite',
              }}
            />
            interactive
          </span>
        )}
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        style={{
          padding: '1.25rem',
          minHeight: 280,
          maxHeight: 360,
          overflowY: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          lineHeight: 1.75,
          userSelect: 'text',
        }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              color: lineColor(line.type),
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {line.text || '\u00A0'}
          </div>
        ))}

        {/* Input row */}
        {ready ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
            <span style={{ color: 'var(--amber)', flexShrink: 0 }}>varun@ai:~$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                flex: 1,
                caretColor: 'var(--amber)',
                minWidth: 0,
              }}
            />
          </div>
        ) : (
          /* Blinking cursor during intro */
          <span
            style={{
              display: 'inline-block',
              width: 7,
              height: 13,
              background: 'var(--amber)',
              animation: 'blink 0.8s infinite',
              verticalAlign: 'middle',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default InteractiveTerminal;
