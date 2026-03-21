import React from 'react';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { SiHuggingface, SiLeetcode } from 'react-icons/si';

const SOCIALS = [
  { href: 'https://linkedin.com/in/bejugamvarun', icon: <FaLinkedin />, label: 'LinkedIn' },
  { href: 'https://github.com/bejugamvarun', icon: <FaGithub />, label: 'GitHub' },
  { href: 'https://x.com/bejugamvarun', icon: <FaSquareXTwitter />, label: 'X / Twitter' },
  { href: 'https://huggingface.co/bejugamvarun', icon: <SiHuggingface />, label: 'HuggingFace' },
  { href: 'https://leetcode.com/u/varun0603/', icon: <SiLeetcode />, label: 'LeetCode' },
  { href: 'mailto:bejugamvarun@gmail.com', icon: <FaEnvelope />, label: 'Email' },
];

const Footer: React.FC = () => (
  <footer
    style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--surface)',
      padding: '2.25rem 1.5rem',
      position: 'relative',
      zIndex: 1,
    }}
  >
    <div
      style={{
        maxWidth: 1080,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
      }}
    >
      {/* Left — terminal prompt */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--amber)',
            marginBottom: '0.2rem',
          }}
        >
          varun@ai:~${' '}
          <span style={{ color: 'var(--text-muted)' }}>echo &quot;thanks for visiting&quot;</span>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--text-dim)',
          }}
        >
          © {new Date().getFullYear()} Varun Kumar Bejugam · All rights reserved
        </div>
      </div>

      {/* Right — social icons */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.href.startsWith('mailto') ? undefined : '_blank'}
            rel="noopener noreferrer"
            aria-label={s.label}
            title={s.label}
            style={{
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = 'var(--amber)';
              el.style.borderColor = 'rgba(240,180,41,0.35)';
              el.style.background = 'var(--amber-10)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = 'var(--text-muted)';
              el.style.borderColor = 'var(--border)';
              el.style.background = 'var(--surface-2)';
            }}
          >
            {s.icon}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
