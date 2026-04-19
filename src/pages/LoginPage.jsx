// src/pages/LoginPage.jsx
import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/firebase';
import styles from './AuthPage.module.css';
import logo from '../assets/logo.png';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await loginUser(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.backdrop} />
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoRow}>
          <img src={logo} alt="UniStay Logo" className={styles.logoImg} />
          <div>
            <div className={styles.logoName}>UniStay</div>
            <div className={styles.logoSub}>Student Hostel Dashboard</div>
          </div>
        </div>

        <h2 className={styles.heading}>Welcome back</h2>
        <p className={styles.subHeading}>Sign in to your account</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label className={styles.label}>Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="you@college.edu"
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? <span className={styles.btnSpinner} /> : null}
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className={styles.switchText}>
          Don't have an account?{' '}
          <Link to="/signup" className={styles.switchLink}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

function getFriendlyError(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
