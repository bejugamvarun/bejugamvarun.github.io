import Layout from '../components/Layout';
import styles from '../styles/Resume.module.css';

const Resume: React.FC = () => {
  return (
    <Layout>
      <section className={styles.resumeSection}>
        <h1>My Resume</h1>
        <iframe 
          src="/resume.pdf" 
          width="100%" 
          height="600px" 
          className={styles.pdfViewer} 
          title="Resume PDF"
        ></iframe>
        <a href="/resume.pdf" download className={styles.downloadBtn}>Download Resume</a>
      </section>
    </Layout>
  );
};

export default Resume;
