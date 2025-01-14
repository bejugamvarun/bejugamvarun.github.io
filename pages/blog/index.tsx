import Link from 'next/link';
import Layout from '../../components/Layout';
import { getSortedPostsData } from '../../lib/markdown';
import styles from '../../styles/Blog.module.css';

interface BlogProps {
  allPostsData: {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
  }[];
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

const Blog: React.FC<BlogProps> = ({ allPostsData }) => {
  return (
    <Layout>
      <section className={styles.blogSection}>
        <h1>Blog</h1>
        <div className={styles.grid}>
          {allPostsData.map(({ slug, title, date, excerpt }) => (
            <Link href={`/blog/${slug}`} key={slug}>
              <div className={styles.card}>
                <h2>{title}</h2>
                <p>{excerpt}</p>
                <small>{date}</small>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
