import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NAV = [
  { href: '/', label: 'home' },
  { href: '/experience', label: 'experience' },
  { href: '/projects', label: 'projects' },
  { href: '/blog', label: 'blog' },
  { href: '/resume', label: 'resume' },
  { href: '/contact', label: 'contact' },
];

const Header: React.FC = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); }, [router.pathname]);

  const isActive = (href: string) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 'var(--nav-height)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          background: scrolled ? 'rgba(6, 10, 15, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'background 0.35s, border-color 0.35s',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 1080,
            margin: '0 auto',
            padding: '0 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                background: 'var(--amber)',
                color: '#000',
                borderRadius: '7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.7rem',
                letterSpacing: '-0.02em',
                flexShrink: 0,
              }}
            >
              VK
            </span>
            <span style={{ color: 'var(--text-muted)' }}>varun</span>
            <span style={{ color: 'var(--text-dim)' }}>@ai:~$</span>
          </Link>

          {/* Desktop nav */}
          <ul
            id="desktop-nav"
            style={{
              display: 'flex',
              listStyle: 'none',
              gap: '0.2rem',
              alignItems: 'center',
            }}
          >
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      padding: '0.38rem 0.75rem',
                      borderRadius: '6px',
                      color: active ? 'var(--amber)' : 'var(--text-muted)',
                      background: active ? 'var(--amber-10)' : 'transparent',
                      border: active
                        ? '1px solid rgba(240,180,41,0.2)'
                        : '1px solid transparent',
                      transition: 'all 0.18s',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.color = 'var(--text)';
                        (e.currentTarget as HTMLElement).style.background = 'var(--surface)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                      }
                    }}
                  >
                    {active ? '› ' : ''}{item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Online status */}
            <div
              id="status-indicator"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--green)',
                letterSpacing: '0.04em',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--green)',
                  animation: 'pulse-dot 2.2s infinite',
                  display: 'inline-block',
                }}
              />
              online
            </div>

            {/* Mobile hamburger */}
            <button
              id="mobile-btn"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                padding: '0.4rem 0.55rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                lineHeight: 1,
                cursor: 'pointer',
                display: 'none',
              }}
            >
              {open ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--nav-height)',
            left: 0,
            right: 0,
            zIndex: 99,
            background: 'rgba(6, 10, 15, 0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border)',
            padding: '0.5rem 1.5rem 1rem',
          }}
        >
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  color: active ? 'var(--amber)' : 'var(--text-muted)',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {active ? '› ' : '  '}{item.label}
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 680px) {
          #desktop-nav { display: none !important; }
          #status-indicator { display: none !important; }
          #mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Header;
