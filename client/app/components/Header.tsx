import { NavLink, useLocation } from 'react-router';
import styles from '../styles/Header.module.css';
import themes from '../styles/Body.module.css';
import type { User } from '../types';
import { useTheme } from '../context/ThemeContext';

const paths = ['dashboard', 'board', 'jobs'];

export default function Header({ name }: User) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const location = useLocation();

  return (
    <header id={styles.header}>
      <h5 id={styles.logo}>JobTracker</h5>
      {name ? (
        <p className={styles.logo}>Hello {name}!</p>
      ) : (
        <p className={styles.username}>Welcome Guest!</p>
      )}
      <p className={styles.sections}>MENU</p>
      {paths.map((path) => (
        <NavLink
          key={path}
          to={path}
          className={styles.links}
          style={{
            ...(location.pathname.slice(1) === path && {
              color: '#F4F3EF',
              background: 'linear-gradient(90deg, #1F4A30 0%, #F4F3EF 90%)',
            }),
          }}
        >
          {path === 'board'
            ? 'Applications'
            : path.charAt(0).toUpperCase() + path.slice(1)}
        </NavLink>
      ))}
      <p className={styles.sections}>GENERAL</p>
      <NavLink
        to="/settings"
        className={styles.links}
        style={{
          ...(location.pathname.slice(1) === 'settings' && {
            color: '#F4F3EF',
            background: 'linear-gradient(90deg, #1F4A30 0%, #F4F3EF 90%)',
          }),
        }}
      >
        Settings
      </NavLink>
      {location.pathname == '/login' ? (
        <NavLink
          to="/register"
          id={styles.toAuth}
          className={styles.links}
        >
          Register
        </NavLink>
      ) : location.pathname != '/login' && location.pathname == '/register' ? (
        <NavLink
          to="/login"
          id={styles.toAuth}
          className={styles.links}
        >
          Login
        </NavLink>
      ) : (
        <NavLink
          to="/logout"
          id={styles.toAuth}
          className={styles.links}
        >
          Logout
        </NavLink>
      )}
      <button
        className={themes.toggleTrack}
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        data-state={isDark ? 'checked' : 'unchecked'}
      >
        <span
          className={themes.toggleThumb}
          style={{
            transform:
              theme === 'dark' ? 'translateX(2.5rem)' : 'translateX(0rem)',
          }}
        />
      </button>
    </header>
  );
}
