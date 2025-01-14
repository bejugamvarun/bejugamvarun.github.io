import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  const [text, setText] = useState('');
  const fullText = "Hi, I'm Varun Kumar Bejugam";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      setTimeout(() => {
        setText((prev) => prev + fullText[index]);
        setIndex(index + 1);
      }, 150);
    }
  }, [index]);

  return (
    <Layout>
      <div className={styles.hero}>
        <h1>{text}<span className={styles.cursor}>|</span></h1>
        <p>A Software Engineer and aspiring AI/ML Engineer.</p>
      </div>
    </Layout>
  );
};

export default Home;
