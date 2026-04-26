import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getSortedPostsData } from '../../lib/markdown';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
}

interface Props {
  allPosts: Post[];
}

export async function getStaticProps() {
  const allPosts = getSortedPostsData();
  return { props: { allPosts } };
}

const Blog: React.FC<Props> = ({ allPosts }) => (
  <Layout>
    <Head>
      <title>Writing | Varun Kumar Bejugam</title>
      <meta name="description" content="Thoughts on AI research, particle physics, software engineering, and building at the intersection of ML and finance." />
    </Head>

    <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="container section">
        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="section-label">Writing</div>
          <h1
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              marginBottom: '1rem',
            }}
          >
            stdout
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 520, lineHeight: 1.7 }}>
            Thoughts on AI research, engineering at scale, and what I&apos;m learning at the
            intersection of ML and finance.
          </p>
        </div>

        {/* Posts */}
        {allPosts.length === 0 ? (
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '3rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '0.75rem',
              }}
            >
              $ ls ./posts/
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No posts yet. First entry incoming...
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {allPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  display: 'block',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-bright)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem 2.25rem',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.18s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--amber)';
                  el.style.transform = 'translateY(-2px)';
                  el.style.boxShadow = '0 8px 32px rgba(240,180,41,0.08)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--border)';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                {/* Amber accent bar */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 3,
                    height: '100%',
                    background: 'var(--amber)',
                    opacity: 0.5,
                    borderRadius: '4px 0 0 4px',
                  }}
                />

                {/* Date + read time row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--amber)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {post.date}
                  </span>
                </div>

                {/* Title */}
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1.35rem',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.25,
                    marginBottom: post.excerpt ? '0.75rem' : '1rem',
                    color: 'var(--text)',
                  }}
                >
                  {post.title}
                </h2>

                {/* Excerpt */}
                {post.excerpt && (
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.7,
                      marginBottom: '1.25rem',
                      maxWidth: '72ch',
                    }}
                  >
                    {post.excerpt}
                  </p>
                )}

                {/* Footer row: tags + arrow */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {post.tags && post.tags.length > 0 ? (
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {post.tags.map((t) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                  ) : <span />}

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'var(--text-dim)',
                    }}
                  >
                    read →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  </Layout>
);

export default Blog;
