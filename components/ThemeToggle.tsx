import { useTheme } from '../context/ThemeContext';
import styles from '../styles/Header.module.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.toggleContainer} onClick={toggleTheme}>
      <div className={`${styles.toggleSwitch} ${theme === 'dark' ? styles.dark : ''}`}>
        <span className={styles.icon}>{theme === 'light' ? '☀️' : '🌙'}</span>
      </div>
    </div>
  );
};

export default ThemeToggle;
