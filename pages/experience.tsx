import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Layout from '../components/Layout';

/* ── Data ─────────────────────────────────────────────── */

const EXPERIENCE = [
  {
    company: 'Goldman Sachs',
    role: 'Associate Software Engineer (SDE2)',
    dept: 'Liquidity Risk Applications',
    period: 'Aug 2025 – Present',
    current: true,
    accent: 'amber' as const,
    bullets: [
      'Architecting mission-critical regulatory compliance platforms to compute FR2052a and other Federal Reserve Board mandated liquidity risk metrics at stringent accuracy standards',
      'Leading cloud migration — designing scalable AWS infrastructure with ECS, Fargate, ECR, S3, and MWAA for serverless container orchestration of complex data pipelines',
      'Engineering multi-stage Apache Airflow DAGs in Python to orchestrate end-to-end risk calculation workflows: extraction, transformation, validation, and reporting',
      'Spearheading an advanced GenAI analytics platform using multi-agent LLM systems (AWS Bedrock, SageMaker, AgentCore, LangChain, Google ADK) to automate dynamic regulatory report generation',
      'Designing custom LLM architectures fine-tuned on financial risk domain datasets with agentic orchestration for data extraction, quantitative analysis, narrative generation, and compliance checking',
    ],
    tags: ['Python', 'AWS Bedrock', 'LangChain', 'SageMaker', 'AgentCore', 'Google ADK', 'Apache Airflow', 'ECS / Fargate', 'Multi-Agent LLM', 'PyTorch'],
  },
  {
    company: 'WissenIT',
    role: 'Software Engineer Intern',
    dept: 'Healthcare Technology',
    period: 'Feb 2025 – Aug 2025',
    current: false,
    accent: 'cyan' as const,
    bullets: [
      'Built and maintained Spring Boot microservices to store and deliver patient medical records for internal hospital use',
      'Developed HIPAA-compliant RESTful APIs to securely transmit EMR data to doctors and front-desk staff',
      'Designed React-based frontend components for accessing and recording patient data',
      'Deployed services using Docker and Kubernetes for high availability and scalability',
    ],
    tags: ['Spring Boot', 'Java', 'React', 'RESTful APIs', 'Docker', 'Kubernetes', 'HIPAA'],
  },
  {
    company: 'NCRVoyix',
    role: 'Software Engineer II',
    dept: 'Internet Banking Platform',
    period: 'Apr 2023 – Aug 2023',
    current: false,
    accent: 'green' as const,
    bullets: [
      'Architected and deployed 25+ microservices for an internet banking platform serving 400+ credit unions, scaling to 5M+ transactions daily',
      'Engineered a scalable LLM-powered Virtual Banking Assistant, fine-tuned on customer financial data to analyze spending behavior and provide personalized financial insights',
      'Tuned high-performance Java Spring WebFlux microservices with Netty reactive servers — achieving 99.99% uptime and 40% reduced latency',
      'Optimized distributed caching with Redis and PostgreSQL, reducing response time by 35% for high-traffic banking requests',
      'Hardened platform security with SonarQube, AquaSec, and Mend — proactively eliminating 90%+ vulnerabilities across 2M+ users per bank',
    ],
    tags: ['Java', 'Spring WebFlux', 'GKE', 'Redis', 'PostgreSQL', 'LLM', 'ArgoCD', 'Helm', 'Kafka', 'SonarQube'],
  },
  {
    company: 'NCRVoyix',
    role: 'Software Engineer I',
    dept: 'Internet Banking Platform',
    period: 'Aug 2021 – Apr 2023',
    current: false,
    accent: 'green' as const,
    bullets: [
      'Developed a Central Authentication & Configuration Service for secure multi-bank authentication using scalable JWT sessions',
      'Programmed adapter microservices for secure transaction routing and banking data exchange with third-party vendors (Fiserv, Zelle)',
      'Built event-driven architecture using Apache Kafka, processing real-time banking transactions with low latency',
      'Developed RESTful APIs with Spring WebFlux & PostgreSQL, enhancing data access speeds by 50%',
    ],
    tags: ['Java', 'Spring Boot', 'Apache Kafka', 'JWT', 'PostgreSQL', 'Docker', 'Kubernetes', 'Helm'],
  },
  {
    company: 'NCRVoyix',
    role: 'Software Engineer Intern',
    dept: 'Cloud & Data Engineering',
    period: 'Feb 2021 – Aug 2021',
    current: false,
    accent: 'green' as const,
    bullets: [
      'Automated batch job execution for credit card reward processing using Google Cloud Scheduler, Apache Beam, and DataFlow',
      'Prototyped a scalable rewards extraction engine using Google Dataproc, enhancing data batch processing reliability',
    ],
    tags: ['GCP', 'Apache Beam', 'DataFlow', 'Google Dataproc', 'Python', 'Cloud Scheduler'],
  },
  {
    company: 'Virtusa',
    role: 'Software Engineer Intern',
    dept: 'IoT & Machine Learning',
    period: 'Jun 2020 – Nov 2020',
    current: false,
    accent: 'amber' as const,
    bullets: [
      'Delivered a machine learning-powered IoT automation system managing 1,000+ interactions daily, cutting manual intervention by 40%',
    ],
    tags: ['Python', 'Machine Learning', 'IoT'],
  },
];

const EDUCATION = [
  {
    school: 'University of North Carolina at Charlotte',
    degree: 'Master of Science in Computer Science',
    gpa: '3.90 / 4.00',
    period: 'Aug 2023 – Dec 2024',
    coursework: 'Software Engineering · Cloud Computing · Intelligent Systems · Machine Learning · Advanced Database Management · Full-Stack Development',
  },
  {
    school: 'Jawaharlal Nehru Technological University',
    degree: 'Bachelor of Technology in Computer Science',
    gpa: '8.2 / 10.00',
    period: 'Jun 2017 – Jul 2021',
    coursework: 'Data Structures · Algorithms · Networking · OOP with Java · Software System Design Patterns',
  },
];

/* ── Helpers ──────────────────────────────────────────── */

const accentVar = (a: 'amber' | 'cyan' | 'green') =>
  a === 'amber' ? 'var(--amber)' : a === 'cyan' ? 'var(--cyan)' : 'var(--green)';

const accentBg = (a: 'amber' | 'cyan' | 'green') =>
  a === 'amber' ? 'var(--amber-10)' : a === 'cyan' ? 'var(--cyan-10)' : 'var(--green-10)';

const accentBorder = (a: 'amber' | 'cyan' | 'green') =>
  a === 'amber' ? 'rgba(240,180,41,0.22)' : a === 'cyan' ? 'rgba(34,217,255,0.2)' : 'rgba(57,255,145,0.2)';

/* ── Component ────────────────────────────────────────── */

const Experience: React.FC = () => (
  <Layout>
    <NextSeo
      title="Experience | Varun Kumar Bejugam"
      description="Professional experience of Varun Kumar Bejugam — Goldman Sachs, NCRVoyix, WissenIT, and more."
    />

    <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="container section">

        {/* Page header */}
        <div style={{ marginBottom: '4rem' }}>
          <div className="section-label">Career</div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              marginBottom: '1rem',
            }}
          >
            Experience
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 540, lineHeight: 1.7 }}>
            5+ years building production systems across fintech, healthcare, and banking — from
            startup internships to mission-critical infrastructure at Goldman Sachs.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div
            style={{
              position: 'absolute',
              left: 15,
              top: 8,
              bottom: 8,
              width: 1,
              background: 'linear-gradient(to bottom, var(--amber), var(--border) 80%, transparent)',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {EXPERIENCE.map((job, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '1.75rem',
                  alignItems: 'flex-start',
                }}
              >
                {/* Timeline dot */}
                <div style={{ flexShrink: 0, width: 30, paddingTop: '1.6rem', display: 'flex', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: job.current ? 14 : 10,
                      height: job.current ? 14 : 10,
                      borderRadius: '50%',
                      background: accentVar(job.accent),
                      boxShadow: job.current ? `0 0 12px ${accentVar(job.accent)}` : 'none',
                      border: `2px solid var(--bg)`,
                      outline: `2px solid ${accentVar(job.accent)}`,
                      flexShrink: 0,
                    }}
                  />
                </div>

                {/* Card */}
                <div
                  style={{
                    flex: 1,
                    background: 'var(--surface)',
                    border: `1px solid ${job.current ? accentVar(job.accent) : 'var(--border)'}`,
                    borderLeft: `3px solid ${accentVar(job.accent)}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem 1.75rem',
                    transition: 'border-color 0.25s',
                    opacity: job.current ? 1 : 0.92,
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      marginBottom: '1.1rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                        <h2
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            color: 'var(--text)',
                          }}
                        >
                          {job.company}
                        </h2>
                        {job.current && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              background: 'var(--amber-10)',
                              border: '1px solid rgba(240,180,41,0.25)',
                              borderRadius: '100px',
                              padding: '0.15rem 0.6rem',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.6rem',
                              color: 'var(--amber)',
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                            }}
                          >
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--amber)', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
                            Current
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          color: accentVar(job.accent),
                          marginBottom: '0.1rem',
                        }}
                      >
                        {job.role}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {job.dept}
                      </div>
                    </div>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        padding: '0.3rem 0.65rem',
                      }}
                    >
                      {job.period}
                    </span>
                  </div>

                  {/* Bullets */}
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      marginBottom: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    {job.bullets.map((b, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          gap: '0.6rem',
                          alignItems: 'flex-start',
                          fontSize: '0.875rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.6,
                        }}
                      >
                        <span
                          style={{
                            color: accentVar(job.accent),
                            flexShrink: 0,
                            marginTop: '0.2rem',
                            fontSize: '0.7rem',
                          }}
                        >
                          ▸
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {job.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          background: accentBg(job.accent),
                          border: `1px solid ${accentBorder(job.accent)}`,
                          borderRadius: '100px',
                          padding: '0.18rem 0.6rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.67rem',
                          color: accentVar(job.accent),
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div style={{ marginTop: '5rem' }}>
          <div className="section-label">Education</div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginBottom: '2rem',
            }}
          >
            Academic Background
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {EDUCATION.map((edu) => (
              <div
                key={edu.school}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderLeft: '3px solid var(--amber)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--amber)',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  {edu.period}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginBottom: '0.2rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {edu.school}
                </h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  {edu.degree}
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'var(--amber-10)',
                    border: '1px solid rgba(240,180,41,0.2)',
                    borderRadius: '100px',
                    padding: '0.18rem 0.65rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--amber)',
                    marginBottom: '0.85rem',
                  }}
                >
                  GPA {edu.gpa}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.7,
                  }}
                >
                  {edu.coursework}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resume CTA */}
        <div
          style={{
            marginTop: '3.5rem',
            padding: '1.75rem 2rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
              $ cat resume.pdf
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600 }}>
              Want the full PDF?
            </div>
          </div>
          <Link href="/resume" className="btn-primary">
            View Resume →
          </Link>
        </div>
      </div>
    </div>
  </Layout>
);

export default Experience;
