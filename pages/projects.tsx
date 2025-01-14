import Layout from '../components/Layout';
import styles from '../styles/Projects.module.css';
import Image from 'next/image';

interface Project {
  title: string;
  description: string;
  image: string;
  link: string;
}

const projects: Project[] = [
  {
    title: 'Smart Financial Advisor',
    description: 'AI-driven financial insights with Python and Langchain.',
    image: '/images/finance_project.jpg',
    link: 'https://github.com/yourusername/smart-financial-advisor'
  },
  {
    title: 'Magic Dance - Pose Transfer',
    description: 'ControlNet-based image pose transfer using PyTorch.',
    image: '/images/magic_dance.jpg',
    link: 'https://github.com/yourusername/magic-dance'
  },
  {
    title: 'Sepsis Prediction',
    description: 'Early detection system for sepsis using machine learning.',
    image: '/images/sepsis_project.jpg',
    link: 'https://github.com/yourusername/sepsis-prediction'
  }
];

const Projects: React.FC = () => {
  return (
    <Layout>
      <section className={styles.projectsSection}>
        <h1>My Projects</h1>
        <div className={styles.grid}>
          {projects.map((project, index) => (
            <div key={index} className={styles.card}>
              <Image src={project.image} alt={project.title} width={300} height={200} />
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <a href={project.link} target="_blank" rel="noopener noreferrer">View Project</a>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
