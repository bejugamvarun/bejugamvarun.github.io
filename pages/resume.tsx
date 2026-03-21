import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';

const Resume: React.FC = () => {
  const router = useRouter();
  const base = router.basePath || '';
  const pdfUrl = `${base}/resume.pdf`;

  return (
    <Layout>
      <Head>
        <title>Resume | Varun Kumar Bejugam</title>
        <meta name="description" content="Resume of Varun Kumar Bejugam — AI/ML Engineer at Goldman Sachs." />
      </Head>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="container section">
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem',
              marginBottom: '2.5rem',
            }}
          >
            <div>
              <div className="section-label">Resume</div>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                }}
              >
                Curriculum Vitae
              </h1>
            </div>
            <a href={pdfUrl} download="Varun_Kumar_Bejugam_Resume.pdf" className="btn-primary">
              Download PDF →
            </a>
          </div>

          {/* PDF viewer */}
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
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
                  resume.pdf
                </span>
              </div>
              <a
                href={pdfUrl}
                download="Varun_Kumar_Bejugam_Resume.pdf"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--amber)',
                }}
              >
                ↓ download
              </a>
            </div>

            <iframe
              src={pdfUrl}
              style={{
                width: '100%',
                height: '80vh',
                border: 'none',
                display: 'block',
                background: '#fff',
              }}
              title="Varun Kumar Bejugam Resume"
            />
          </div>

          {/* Note */}
          <p
            style={{
              marginTop: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
            }}
          >
            Can&apos;t view the PDF?{' '}
            <a
              href={pdfUrl}
              download
              style={{ color: 'var(--amber)', textDecoration: 'underline' }}
            >
              Download it directly
            </a>
            .
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Resume;
