import Head from 'next/head';
import Layout from '../components/Layout';

const PROJECTS = [
  /* ── Professional ──────────────────────────────────── */
  {
    id: 'gs-genai',
    category: 'Professional · Goldman Sachs',
    type: 'GenAI · Multi-Agent Systems · FinTech',
    title: 'GenAI Regulatory Analytics Platform',
    description:
      'Spearheading an advanced generative AI platform that automates dynamic Federal Reserve regulatory report generation. Uses multi-agent LLM orchestration with specialized agents for data extraction, quantitative analysis, narrative generation, and compliance checking — dramatically reducing manual reporting overhead.',
    tags: ['AWS Bedrock', 'SageMaker', 'AgentCore', 'LangChain', 'Google ADK', 'PyTorch', 'LLM Fine-tuning'],
    accent: 'amber' as const,
    status: 'In Progress',
    href: null,
  },
  {
    id: 'gs-risk',
    category: 'Professional · Goldman Sachs',
    type: 'Cloud Infrastructure · Regulatory Compliance',
    title: 'Liquidity Risk Compliance Platform',
    description:
      'Architecting mission-critical infrastructure for computing FR2052a and Federal Reserve Board mandated liquidity risk metrics. Includes a full AWS cloud migration (ECS, Fargate, MWAA) and multi-stage Apache Airflow DAGs orchestrating end-to-end risk calculation pipelines with comprehensive error handling.',
    tags: ['Python', 'Apache Airflow', 'AWS ECS', 'Fargate', 'MWAA', 'S3', 'ECR', 'Regulatory Tech'],
    accent: 'amber' as const,
    status: 'In Progress',
    href: null,
  },
  {
    id: 'ncr-banking',
    category: 'Professional · NCRVoyix',
    type: 'Distributed Systems · Fintech',
    title: 'Internet Banking Microservices Platform',
    description:
      'Designed and deployed 25+ production microservices for an internet banking platform serving 400+ credit unions at 5M+ transactions per day. Includes an LLM-powered Virtual Banking Assistant fine-tuned on customer financial data for spending analysis and personalized insights.',
    tags: ['Java', 'Spring WebFlux', 'Apache Kafka', 'Redis', 'PostgreSQL', 'GKE', 'ArgoCD', 'Helm', 'LLM'],
    accent: 'cyan' as const,
    status: 'Shipped',
    href: null,
  },

  /* ── Personal ──────────────────────────────────────── */
  {
    id: 'txn-analytics',
    category: 'Personal Project',
    type: 'Real-Time Data · ML · React',
    title: 'Real-Time Transaction Analytics Platform',
    description:
      'Designed a platform to analyze high-velocity financial transaction data using Apache Kafka and Python, enhancing fraud detection capabilities by 40%. Built interactive React dashboards enabling financial institutions to monitor real-time transaction trends and anomaly signals.',
    tags: ['Python', 'Apache Kafka', 'React', 'Fraud Detection', 'Data Pipelines'],
    accent: 'cyan' as const,
    status: 'Complete',
    href: 'https://github.com/bejugamvarun',
  },
  {
    id: 'credit-risk',
    category: 'Personal Project',
    type: 'Machine Learning · FinTech',
    title: 'Intelligent Credit Risk Assessment',
    description:
      'Implemented a machine learning model for dynamic credit risk evaluation using TensorFlow and scikit-learn, improving classification accuracy by 30%. Integrated secure financial data APIs for real-time credit assessment with full compliance validation.',
    tags: ['Python', 'TensorFlow', 'Scikit-learn', 'Credit Risk', 'ML', 'Financial APIs'],
    accent: 'green' as const,
    status: 'Complete',
    href: 'https://github.com/bejugamvarun',
  },
  {
    id: 'account-monitor',
    category: 'Personal Project',
    type: 'Anomaly Detection · GCP',
    title: 'Predictive Account Monitoring Tool',
    description:
      'Developed a forecasting tool for detecting unusual account activity using Python anomaly detection algorithms. Automated reporting pipelines with Google Cloud DataFlow for real-time alerting on flagged transactions, enabling proactive fraud response.',
    tags: ['Python', 'Anomaly Detection', 'Google Cloud DataFlow', 'Real-Time Alerts'],
    accent: 'green' as const,
    status: 'Complete',
    href: 'https://github.com/bejugamvarun',
  },
];

const accentVar = (a: 'amber' | 'cyan' | 'green') =>
  a === 'amber' ? 'var(--amber)' : a === 'cyan' ? 'var(--cyan)' : 'var(--green)';

const accentBg = (a: 'amber' | 'cyan' | 'green') =>
  a === 'amber' ? 'var(--amber-10)' : a === 'cyan' ? 'var(--cyan-10)' : 'var(--green-10)';

const accentBorder = (a: 'amber' | 'cyan' | 'green') =>
  a === 'amber' ? 'rgba(240,180,41,0.22)' : a === 'cyan' ? 'rgba(34,217,255,0.2)' : 'rgba(57,255,145,0.2)';

const Projects: React.FC = () => (
  <Layout>
    <Head>
      <title>Projects | Varun Kumar Bejugam</title>
      <meta name="description" content="Professional and personal projects by Varun Kumar Bejugam — GenAI systems at Goldman Sachs, banking infrastructure, and ML projects." />
    </Head>

    <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="container section">
        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="section-label">Portfolio</div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              marginBottom: '1rem',
            }}
          >
            Projects
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 580, lineHeight: 1.7 }}>
            From regulatory AI at Goldman Sachs to personal ML experiments — a mix of what I build at work
            and what I build for myself.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {PROJECTS.map((proj) => {
            const Wrapper = proj.href ? 'a' : 'div';
            const wrapperProps = proj.href
              ? { href: proj.href, target: '_blank', rel: 'noopener noreferrer' }
              : {};

            return (
              <Wrapper
                key={proj.id}
                {...wrapperProps}
                style={{
                  display: 'block',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderLeft: `3px solid ${accentVar(proj.accent)}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem 2rem',
                  transition: 'border-color 0.25s, transform 0.2s',
                  textDecoration: 'none',
                  cursor: proj.href ? 'pointer' : 'default',
                }}
                onMouseEnter={proj.href ? (e: React.MouseEvent) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.borderColor = accentVar(proj.accent);
                } : undefined}
                onMouseLeave={proj.href ? (e: React.MouseEvent) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                } : undefined}
              >
                {/* Top row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginBottom: '0.9rem',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.63rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {proj.category}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        color: accentVar(proj.accent),
                        letterSpacing: '0.06em',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {proj.type}
                    </div>
                    <h2
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text)',
                      }}
                    >
                      {proj.title}
                    </h2>
                  </div>

                  {/* Status */}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: accentBg(proj.accent),
                      border: `1px solid ${accentBorder(proj.accent)}`,
                      borderRadius: '100px',
                      padding: '0.25rem 0.75rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      color: accentVar(proj.accent),
                      flexShrink: 0,
                    }}
                  >
                    {proj.status === 'In Progress' && (
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: accentVar(proj.accent), display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
                    )}
                    {proj.status}
                  </span>
                </div>

                {/* Description */}
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.89rem',
                    lineHeight: 1.7,
                    marginBottom: '1.25rem',
                    maxWidth: 700,
                  }}
                >
                  {proj.description}
                </p>

                {/* Tags + link */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {proj.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          background: accentBg(proj.accent),
                          border: `1px solid ${accentBorder(proj.accent)}`,
                          borderRadius: '100px',
                          padding: '0.18rem 0.6rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.67rem',
                          color: accentVar(proj.accent),
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {proj.href && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: accentVar(proj.accent),
                        flexShrink: 0,
                      }}
                    >
                      View on GitHub →
                    </span>
                  )}
                  {!proj.href && proj.status === 'In Progress' && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'var(--text-dim)',
                      }}
                    >
                      Proprietary · NDA
                    </span>
                  )}
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </div>
  </Layout>
);

export default Projects;
