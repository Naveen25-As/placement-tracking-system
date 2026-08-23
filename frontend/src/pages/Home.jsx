import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <section className="hero">
        <div className="hero-content">
          <h1>Track Your Placement Journey</h1>
          <p>
            Manage job applications, monitor interview progress, and stay organized
            throughout your placement season — all in one place.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
            <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
          </div>
        </div>
        <div className="hero-features">
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>Dashboard Analytics</h3>
            <p>View application stats at a glance — applied, shortlisted, interviews, and offers.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🏢</span>
            <h3>Application Management</h3>
            <p>Add, edit, and track every company application with status updates and notes.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Secure & Private</h3>
            <p>JWT authentication keeps your data secure. Only you can see your applications.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
