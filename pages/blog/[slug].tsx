import Layout from '../../components/Layout';
import { getAllPostSlugs, getPostData } from '../../lib/markdown';
import styles from '../../styles/Post.module.css';

interface PostProps {
  postData: {
    title: string;
    date: string;
    contentHtml: string;
  };
}

// ISR: Regenerate page every 10 seconds
export async function getStaticProps({ params }: { params: { slug: string } }) {
  const postData = await getPostData(params.slug);
  return {
    props: {
      postData,
    },
    // revalidate: 10,  // ISR
  };
}

// SSG for dynamic routes
export async function getStaticPaths() {
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: false,  // ISR
  };
}

const Post: React.FC<{ postData: PostProps['postData'] }> = ({ postData }) => {
  return (
    <Layout>
      <article className={styles.post}>
        <h1>{postData.title}</h1>
        <p>{postData.date}</p>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
};

export default Post;
