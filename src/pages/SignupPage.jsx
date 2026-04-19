// src/pages/SignupPage.jsx
import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/firebase';
import styles from './AuthPage.module.css';
import logo from '../assets/logo.png';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', roomNumber: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, roomNumber } = form;
    if (!name || !email || !password || !roomNumber) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await registerUser({ name, email, password, roomNumber });
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
        <div className={styles.logoRow}>
          <img src={logo} alt="UniStay Logo" className={styles.logoImg} />
          <div>
            <div className={styles.logoName}>UniStay</div>
            <div className={styles.logoSub}>Student Hostel Dashboard</div>
          </div>
        </div>

        <h2 className={styles.heading}>Create account</h2>
        <p className={styles.subHeading}>Join your hostel community</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label className={styles.label}>Full name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Max Verstappen"
              autoComplete="name"
            />
          </div>

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

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>Room number</label>
              <input
                type="text"
                name="roomNumber"
                value={form.roomNumber}
                onChange={handleChange}
                className={styles.input}
                placeholder="033"
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
                placeholder="Min. 6 chars"
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? <span className={styles.btnSpinner} /> : null}
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function getFriendlyError(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Try signing in.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
