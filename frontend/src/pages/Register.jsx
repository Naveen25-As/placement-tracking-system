import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    college: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="auth-page">
        <div className="auth-card auth-card-wide">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Register to start tracking your placements</p>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="college">College Name</label>
                <input id="college" name="college" value={form.college} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>
          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
