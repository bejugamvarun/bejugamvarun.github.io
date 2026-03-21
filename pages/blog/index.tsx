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
      <title>Blog | Varun Kumar Bejugam</title>
      <meta name="description" content="Thoughts on AI, machine learning, software engineering, and building at Goldman Sachs." />
    </Head>

    <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="container section">
        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="section-label">Writing</div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              marginBottom: '1rem',
            }}
          >
            Blog
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {allPosts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.5rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  transition: 'border-color 0.2s, transform 0.18s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--amber)';
                  el.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--border)';
                  el.style.transform = 'translateX(0)';
                }}
              >
                {/* Index number */}
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--text-dim)',
                    paddingTop: '0.2rem',
                    flexShrink: 0,
                    minWidth: 28,
                    textAlign: 'right',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      color: 'var(--amber)',
                      marginBottom: '0.4rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {post.date}
                  </div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      letterSpacing: '-0.01em',
                      marginBottom: post.excerpt ? '0.4rem' : 0,
                      color: 'var(--text)',
                    }}
                  >
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.6,
                        marginBottom: post.tags?.length ? '0.75rem' : 0,
                      }}
                    >
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {post.tags.map((t) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                <span
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '1rem',
                    paddingTop: '0.2rem',
                    flexShrink: 0,
                    transition: 'color 0.2s',
                  }}
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  </Layout>
);

export default Blog;
