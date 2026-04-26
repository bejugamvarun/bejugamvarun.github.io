import Head from 'next/head';
import Link from 'next/link';
import { ProfilePageJsonLd } from 'next-seo';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { SiHuggingface } from 'react-icons/si';
import Layout from '../components/Layout';
import NeuralBackground from '../components/NeuralBackground';
import InteractiveTerminal from '../components/InteractiveTerminal';
import { getSortedPostsData } from '../lib/markdown';

/* ── Data ─────────────────────────────────────────────── */

const SKILLS: Record<string, string[]> = {
  'AI / ML': ['PyTorch', 'TensorFlow', 'LangChain', 'AWS Bedrock', 'SageMaker', 'AgentCore', 'Google ADK', 'LLM Fine-tuning', 'Multi-Agent Systems', 'Transformers'],
  'Languages': ['Python', 'Java', 'Kotlin', 'TypeScript', 'JavaScript', 'Golang', 'Bash'],
  'Cloud & DevOps': ['AWS ECS/Fargate', 'Docker', 'Kubernetes', 'Apache Airflow', 'Apache Kafka', 'Helm', 'ArgoCD', 'Terraform', 'GCP'],
  'Backend & Data': ['Spring Boot', 'Spring WebFlux', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'MongoDB', 'Snowflake', 'Kafka'],
};

const PROJECTS = [
  {
    id: 'gs-genai',
    label: 'GenAI · Multi-Agent LLM · Goldman Sachs',
    title: 'GenAI Regulatory Analytics Platform',
    description: 'Spearheading a multi-agent LLM system at Goldman Sachs that automates Federal Reserve regulatory report generation using AWS Bedrock, SageMaker, AgentCore, LangChain, and Google ADK.',
    tags: ['AWS Bedrock', 'AgentCore', 'LangChain', 'Google ADK', 'PyTorch'],
    accent: 'amber' as const,
    href: null,
  },
  {
    id: 'txn-analytics',
    label: 'Real-Time Data · Fraud Detection',
    title: 'Transaction Analytics Platform',
    description: 'High-velocity financial transaction analysis using Apache Kafka and Python with fraud detection improvements of 40%. Interactive React dashboards for real-time trend monitoring.',
    tags: ['Python', 'Kafka', 'React', 'Fraud Detection'],
    accent: 'cyan' as const,
    href: 'https://github.com/bejugamvarun',
  },
  {
    id: 'credit-risk',
    label: 'Machine Learning · FinTech',
    title: 'Intelligent Credit Risk Assessment',
    description: 'ML model for dynamic credit risk evaluation using TensorFlow and scikit-learn, improving classification accuracy by 30%. Integrates secure financial data APIs with compliance validation.',
    tags: ['TensorFlow', 'Scikit-learn', 'Python', 'Credit Risk'],
    accent: 'green' as const,
    href: 'https://github.com/bejugamvarun',
  },
];


/* ── Types ────────────────────────────────────────────── */

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

interface Props {
  recentPosts: Post[];
}

/* ── SSG ──────────────────────────────────────────────── */

export async function getStaticProps() {
  const allPosts = getSortedPostsData() as Post[];
  return { props: { recentPosts: allPosts.slice(0, 3) } };
}

/* ── Helpers ──────────────────────────────────────────── */

const accentVar = (a: 'amber' | 'cyan' | 'green') =>
  a === 'amber' ? 'var(--amber)' : a === 'cyan' ? 'var(--cyan)' : 'var(--green)';

const accentBg = (a: 'amber' | 'cyan' | 'green') =>
  a === 'amber' ? 'var(--amber-10)' : a === 'cyan' ? 'var(--cyan-10)' : 'var(--green-10)';

const accentBorder = (a: 'amber' | 'cyan' | 'green') =>
  a === 'amber'
    ? 'rgba(240,180,41,0.22)'
    : a === 'cyan'
    ? 'rgba(34,217,255,0.2)'
    : 'rgba(57,255,145,0.2)';

/* ── Component ────────────────────────────────────────── */

const Home: React.FC<Props> = ({ recentPosts }) => {

  return (
    <Layout>
      <Head>
        <title>Varun Kumar Bejugam | AI/ML Engineer at Goldman Sachs</title>
        <meta name="description" content="Varun Kumar Bejugam — Software Engineer and AI/ML researcher at Goldman Sachs. Building multi-agent LLM systems at the intersection of AI and finance." />
        <meta name="keywords" content="Varun Kumar Bejugam, Varun Bejugam, AI ML Engineer, Goldman Sachs, machine learning, LLM, multi-agent systems" />
        <link rel="canonical" href="https://bejugamvarun.github.io/bejugamvarun.github.io" />
      </Head>
      <ProfilePageJsonLd
        dateCreated="2024-01-01"
        dateModified={new Date().toISOString().split('T')[0]}
        mainEntity={{
          '@type': 'Person',
          name: 'Varun Kumar Bejugam',
          givenName: 'Varun Kumar',
          familyName: 'Bejugam',
          alternateName: 'Varun Bejugam',
          jobTitle: 'Software Engineer & AI/ML Researcher',
          worksFor: {
            '@type': 'Organization',
            name: 'Goldman Sachs',
            url: 'https://www.goldmansachs.com',
          },
          description: 'Software Engineer and AI/ML researcher at Goldman Sachs. Building multi-agent LLM systems and cloud infrastructure for regulatory finance.',
          url: 'https://bejugamvarun.github.io/bejugamvarun.github.io',
          sameAs: [
            'https://linkedin.com/in/bejugamvarun',
            'https://github.com/bejugamvarun',
            'https://x.com/bejugamvarun',
            'https://huggingface.co/bejugamvarun',
          ],
        }}
      />

      <NeuralBackground />

      {/* ══════════════ HERO ══════════════ */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
          {/* Status badge */}
          <div className="animate-in d-1" style={{ marginBottom: '1.75rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'var(--green-10)',
                border: '1px solid rgba(57,255,145,0.22)',
                borderRadius: '100px',
                padding: '0.28rem 0.85rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--green)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
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
              Software Engineer · AI / ML · Goldman Sachs
            </span>
          </div>

          {/* Name */}
          <div className="animate-in d-2" style={{ marginBottom: '1.5rem' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.2rem, 11vw, 8rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 0.9,
                color: 'var(--text)',
              }}
            >
              VARUN
              <br />
              <span style={{ color: 'var(--amber)' }}>KUMAR</span>
              <br />
              BEJUGAM
              <span
                style={{
                  display: 'inline-block',
                  width: '0.08em',
                  height: '0.85em',
                  background: 'var(--amber)',
                  marginLeft: '0.1em',
                  verticalAlign: 'text-bottom',
                  animation: 'blink 1s infinite',
                }}
              />
            </h1>
          </div>

          {/* Tagline */}
          <div className="animate-in d-3" style={{ marginBottom: '2.25rem' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.82rem, 1.4vw, 0.95rem)',
                color: 'var(--text-muted)',
                maxWidth: 500,
                lineHeight: 1.75,
              }}
            >
              Building intelligent systems at the frontier of AI and finance.
              <br />
              Researcher. Engineer. Builder.
            </p>
          </div>

          {/* CTAs */}
          <div
            className="animate-in d-4"
            style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}
          >
            <Link href="/projects" className="btn-primary">
              Explore Work →
            </Link>
            <Link href="/blog" className="btn-secondary">
              Read Blog
            </Link>
          </div>

          {/* Socials */}
          <div className="animate-in d-5" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { href: 'https://github.com/bejugamvarun', icon: <FaGithub size={15} />, label: 'GitHub' },
              { href: 'https://linkedin.com/in/bejugamvarun', icon: <FaLinkedin size={15} />, label: 'LinkedIn' },
              { href: 'https://x.com/bejugamvarun', icon: <FaSquareXTwitter size={15} />, label: 'X' },
              { href: 'https://huggingface.co/bejugamvarun', icon: <SiHuggingface size={15} />, label: 'HuggingFace' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  background: 'rgba(11,16,23,0.8)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-muted)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = 'var(--amber)';
                  el.style.borderColor = 'rgba(240,180,41,0.3)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = 'var(--text-muted)';
                  el.style.borderColor = 'var(--border)';
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="animate-in d-6"
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'var(--text-dim)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <span>scroll</span>
          <div
            style={{
              width: 1,
              height: 36,
              background: 'linear-gradient(to bottom, var(--text-dim), transparent)',
            }}
          />
        </div>
      </section>

      {/* ══════════════ ABOUT ══════════════ */}
      <section className="section" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '3rem',
              alignItems: 'start',
            }}
          >
            {/* Interactive Terminal */}
            <InteractiveTerminal />

            {/* Bio */}
            <div>
              <div className="section-label">About</div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 4vw, 2.4rem)',
                  fontWeight: 700,
                  marginBottom: '1.25rem',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                }}
              >
                Building AI at
                <br />
                <span style={{ color: 'var(--amber)' }}>Goldman Sachs</span>
              </h2>
              <p
                style={{
                  color: 'var(--text-muted)',
                  lineHeight: 1.8,
                  marginBottom: '1.25rem',
                  fontSize: '0.95rem',
                }}
              >
                SDE2 in Liquidity Risk Applications — shipping GenAI systems that automate
                Federal Reserve regulatory reporting and building cloud-native infrastructure
                that processes mission-critical financial data at scale.
              </p>
              <p
                style={{
                  color: 'var(--text-muted)',
                  lineHeight: 1.8,
                  marginBottom: '2rem',
                  fontSize: '0.95rem',
                }}
              >
                5+ years across fintech, healthcare, and banking. MS Computer Science from
                UNC Charlotte. Currently obsessed with multi-agent LLMs, AWS Bedrock, and
                building things that matter.
              </p>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {[
                  { value: '5+', label: 'Yrs Experience' },
                  { value: 'SDE2', label: 'Goldman Sachs' },
                  { value: 'MS', label: 'UNC Charlotte' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '0.85rem 0.65rem',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.35rem',
                        fontWeight: 800,
                        color: 'var(--amber)',
                        marginBottom: '0.15rem',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.62rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ SKILLS ══════════════ */}
      <section
        className="section"
        style={{
          position: 'relative',
          zIndex: 1,
          background: 'rgba(11,16,23,0.65)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container">
          <div className="section-label">Technical Arsenal</div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              marginBottom: '2.5rem',
              letterSpacing: '-0.03em',
            }}
          >
            Stack &amp; Expertise
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
            }}
          >
            {Object.entries(SKILLS).map(([cat, items]) => (
              <div
                key={cat}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--amber)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.85rem',
                  }}
                >
                  {cat}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {items.map((s) => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PROJECTS ══════════════ */}
      <section className="section" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div className="section-label">Work</div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                }}
              >
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--amber)',
                transition: 'opacity 0.2s',
              }}
            >
              All projects →
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '1rem',
            }}
          >
            {PROJECTS.map((proj) => {
              const Tag = proj.href ? 'a' : 'div';
              const linkProps = proj.href ? { href: proj.href, target: '_blank', rel: 'noopener noreferrer' } : {};
              return (
              <Tag
                key={proj.id}
                {...linkProps}
                style={{
                  display: 'block',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  transition: 'border-color 0.25s, transform 0.2s',
                  textDecoration: 'none',
                  cursor: proj.href ? 'pointer' : 'default',
                }}
                onMouseEnter={(e: React.MouseEvent) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = accentVar(proj.accent);
                  el.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e: React.MouseEvent) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--border)';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.63rem',
                    color: accentVar(proj.accent),
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.7rem',
                  }}
                >
                  {proj.label}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '0.7rem',
                    letterSpacing: '-0.01em',
                    color: 'var(--text)',
                  }}
                >
                  {proj.title}
                </h3>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    lineHeight: 1.65,
                    marginBottom: '1.25rem',
                  }}
                >
                  {proj.description}
                </p>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {proj.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        display: 'inline-block',
                        background: accentBg(proj.accent),
                        border: `1px solid ${accentBorder(proj.accent)}`,
                        borderRadius: '100px',
                        padding: '0.2rem 0.6rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: accentVar(proj.accent),
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Tag>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ BLOG ══════════════ */}
      {recentPosts.length > 0 && (
        <section
          className="section"
          style={{
            position: 'relative',
            zIndex: 1,
            background: 'rgba(11,16,23,0.5)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: '2.5rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div className="section-label">Thoughts</div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                  }}
                >
                  Latest Writing
                </h2>
              </div>
              <Link
                href="/blog"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--amber)',
                }}
              >
                All posts →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '1.1rem 1.4rem',
                    transition: 'border-color 0.2s',
                    flexWrap: 'wrap',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-bright)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        marginBottom: '0.3rem',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {post.date}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        fontSize: '0.975rem',
                        marginBottom: post.excerpt ? '0.25rem' : 0,
                        color: 'var(--text)',
                      }}
                    >
                      {post.title}
                    </div>
                    {post.excerpt && (
                      <div
                        style={{
                          fontSize: '0.84rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.5,
                        }}
                      >
                        {post.excerpt}
                      </div>
                    )}
                  </div>
                  <span style={{ color: 'var(--text-muted)', marginTop: 2, flexShrink: 0 }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Home;
