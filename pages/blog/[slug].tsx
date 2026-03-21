import Link from 'next/link';
import { NextSeo } from 'next-seo';
import Layout from '../../components/Layout';
import { getAllPostSlugs, getPostData } from '../../lib/markdown';

interface PostData {
  title: string;
  date: string;
  excerpt?: string;
  contentHtml: string;
}

interface Props {
  postData: PostData;
}

export async function getStaticPaths() {
  const paths = getAllPostSlugs();
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const postData = await getPostData(params.slug);
  return { props: { postData } };
}

const Post: React.FC<Props> = ({ postData }) => (
  <Layout>
    <NextSeo
      title={`${postData.title} | Varun Kumar Bejugam`}
      description={postData.excerpt || postData.title}
    />

    <div style={{ position: 'relative', zIndex: 1 }}>
      <div
        className="container"
        style={{ paddingTop: '4rem', paddingBottom: '6rem' }}
      >
        {/* Back link */}
        <Link
          href="/blog"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            marginBottom: '2.5rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--amber)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
        >
          ← back to blog
        </Link>

        {/* Article header */}
        <header style={{ marginBottom: '3rem' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--amber)',
              marginBottom: '1rem',
              letterSpacing: '0.06em',
            }}
          >
            {postData.date}
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 5vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: postData.excerpt ? '1rem' : 0,
              color: 'var(--text)',
            }}
          >
            {postData.title}
          </h1>
          {postData.excerpt && (
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '1.05rem',
                lineHeight: 1.65,
              }}
            >
              {postData.excerpt}
            </p>
          )}
        </header>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: 'var(--border)',
            marginBottom: '3rem',
          }}
        />

        {/* Article body */}
        <article
          className="prose"
          style={{ maxWidth: '68ch' }}
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />

        {/* Footer nav */}
        <div
          style={{
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border)',
          }}
        >
          <Link
            href="/blog"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--amber)',
              transition: 'opacity 0.2s',
            }}
          >
            ← All posts
          </Link>
        </div>
      </div>
    </div>
  </Layout>
);

export default Post;
