import { useState } from 'react';
import Head from 'next/head';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { SiHuggingface } from 'react-icons/si';
import Layout from '../components/Layout';

const CHANNELS = [
  {
    label: 'LinkedIn',
    value: '/in/bejugamvarun',
    href: 'https://linkedin.com/in/bejugamvarun',
    icon: <FaLinkedin />,
    accent: 'cyan',
  },
  {
    label: 'GitHub',
    value: 'bejugamvarun',
    href: 'https://github.com/bejugamvarun',
    icon: <FaGithub />,
    accent: 'amber',
  },
  {
    label: 'Email',
    value: 'bejugamvarun@gmail.com',
    href: 'mailto:bejugamvarun@gmail.com',
    icon: <FaEnvelope />,
    accent: 'green',
  },
  {
    label: 'HuggingFace',
    value: 'bejugamvarun',
    href: 'https://huggingface.co/bejugamvarun',
    icon: <SiHuggingface />,
    accent: 'amber',
  },
];

const accentVar = (a: string) =>
  a === 'cyan' ? 'var(--cyan)' : a === 'green' ? 'var(--green)' : 'var(--amber)';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = encodeURIComponent(`Portfolio Contact: ${name}`);
    const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`);
    window.open(`mailto:bejugamvarun@gmail.com?subject=${sub}&body=${body}`);
    setSent(true);
  };

  return (
    <Layout>
      <Head>
        <title>Contact | Varun Kumar Bejugam</title>
        <meta name="description" content="Get in touch with Varun Kumar Bejugam — AI/ML engineer at Goldman Sachs." />
      </Head>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="container section">
          {/* Header */}
          <div style={{ marginBottom: '3.5rem' }}>
            <div className="section-label">Contact</div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                marginBottom: '1rem',
              }}
            >
              Let&apos;s Talk
            </h1>
            <p
              style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 500, lineHeight: 1.7 }}
            >
              Whether it&apos;s a collaboration, research question, or just a chat about AI — I&apos;m
              always open to interesting conversations.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              alignItems: 'start',
            }}
          >
            {/* Contact channels */}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                }}
              >
                $ cat ./contact_channels.json
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {CHANNELS.map((ch) => (
                  <a
                    key={ch.label}
                    href={ch.href}
                    target={ch.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '0.9rem 1.2rem',
                      transition: 'border-color 0.2s',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = accentVar(ch.accent);
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '8px',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: accentVar(ch.accent),
                        fontSize: '0.95rem',
                        flexShrink: 0,
                      }}
                    >
                      {ch.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.65rem',
                          color: 'var(--text-muted)',
                          marginBottom: '0.15rem',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {ch.label}
                      </div>
                      <div
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--text)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {ch.value}
                      </div>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>→</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Message form */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
              }}
            >
              {/* Terminal bar */}
              <div
                style={{
                  padding: '0.65rem 1rem',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--surface-2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                  <span
                    key={c}
                    style={{ width: 10, height: 10, borderRadius: '50%', background: c }}
                  />
                ))}
                <span
                  style={{
                    marginLeft: '0.4rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  compose_message.sh
                </span>
              </div>

              <div style={{ padding: '1.75rem' }}>
                {sent ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.5rem',
                        color: 'var(--green)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      ✓
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        color: 'var(--green)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Message composed
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Your email client should have opened. Looking forward to talking!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          color: 'var(--amber)',
                          marginBottom: '0.4rem',
                          letterSpacing: '0.04em',
                        }}
                      >
                        $ name
                      </label>
                      <input
                        className="input-field"
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          color: 'var(--amber)',
                          marginBottom: '0.4rem',
                          letterSpacing: '0.04em',
                        }}
                      >
                        $ email
                      </label>
                      <input
                        className="input-field"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          color: 'var(--amber)',
                          marginBottom: '0.4rem',
                          letterSpacing: '0.04em',
                        }}
                      >
                        $ message
                      </label>
                      <textarea
                        className="input-field"
                        placeholder="What's on your mind?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                    <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                      Send Message →
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
