import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { API_BASE } from '../../services/api';
import styles from '../../styles/Register.module.css';

export function RegisterForm() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? `Register failed ${res.status}`);
      }
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1 className={styles.title}>JobTracker</h1>
      <div className={styles.content}>
        <div id={styles.register_form}>
          <h5 style={{ color: 'var(--kanban-remove-hover)' }}>
            {error && <p>{error}</p>}
          </h5>
          <h2 id={styles.mainHeader}>Create You Account</h2>
          <form
            id={styles.register_from}
            onSubmit={handleSubmit}
          >
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="@email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              id={styles.register}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <div id={styles.divider} />
          <h5 style={{ color: 'slategray' }}>
            Already have an account?
            <NavLink
              to="/login"
              style={{
                textDecoration: 'none',
                marginLeft: '0.5rem',
                fontWeight: '1px',
              }}
            >
              Sign In
            </NavLink>
          </h5>
        </div>
        <div id={styles.graphic}></div>
      </div>
    </main>
  );
}
