import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import nioraWordmark from '../../assets/niora-wordmark.png';
import './AdminLogin.css';

const AdminLogin = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { if (user) navigate('/admin'); }, [user, navigate]);

  const handleField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(form.username, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login">
      <div className="login__atmosphere" aria-hidden="true" />

      <Link to="/" className="login__back">
        <ArrowLeft size={15} strokeWidth={1.6} /> Back to Storefront
      </Link>

      <motion.div
        className="login__card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={nioraWordmark} alt="NIORA" className="login__wordmark-img" />
        <span className="eyebrow eyebrow--cream">— Atelier Console —</span>
        <h1 className="login__title">
          Welcome <span className="serif-italic">back</span>
        </h1>
        <p className="login__sub">
          Sign in to manage your collection, orders, and enquiries.
        </p>

        <form onSubmit={handleSubmit} className="login__form">
          <div className="login__field">
            <User size={16} strokeWidth={1.6} className="login__field-icon" />
            <input
              name="username"
              type="text"
              required
              autoFocus
              value={form.username}
              onChange={handleField}
              placeholder="Username"
            />
          </div>
          <div className="login__field">
            <Lock size={16} strokeWidth={1.6} className="login__field-icon" />
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleField}
              placeholder="Password"
            />
          </div>

          {error && <p className="login__error">{error}</p>}

          <button type="submit" className="btn btn--cream btn--block" disabled={submitting}>
            {submitting ? 'Signing in…' : <>Sign In <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="login__hint">
          Default: <code>admin</code> / <code>niora123</code> (change after first login)
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
