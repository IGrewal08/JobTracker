import { Link } from 'react-router';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer id={styles.footer}>
      <Link
        to="/"
        id={styles.github}
      >
        _{'\u00A9'}GitHub
      </Link>
      <div>&copy; 2026</div>
    </footer>
  );
}
