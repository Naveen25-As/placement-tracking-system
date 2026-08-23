import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { formatDate, getErrorMessage } from '../../utils/helpers';

export default function UserDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          api.get('/placements/stats'),
          api.get('/placements?page=0&size=5'),
        ]);
        setStats(statsRes.data.data);
        setRecent(appsRes.data.data.content);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="loading-screen"><div className="spinner" /></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link to="/placements/new" className="btn btn-primary">+ Add Application</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{stats.totalApplications}</span>
            <span className="stat-label">Total Applications</span>
          </div>
          <div className="stat-card stat-info">
            <span className="stat-value">{stats.applied}</span>
            <span className="stat-label">Applied</span>
          </div>
          <div className="stat-card stat-warning">
            <span className="stat-value">{stats.shortlisted}</span>
            <span className="stat-label">Shortlisted</span>
          </div>
          <div className="stat-card stat-primary">
            <span className="stat-value">{stats.interviews}</span>
            <span className="stat-label">Interviews</span>
          </div>
          <div className="stat-card stat-success">
            <span className="stat-value">{stats.offers}</span>
            <span className="stat-label">Offers</span>
          </div>
          <div className="stat-card stat-danger">
            <span className="stat-value">{stats.rejected}</span>
            <span className="stat-label">Rejected</span>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>Recent Applications</h2>
          <Link to="/placements" className="btn btn-outline btn-sm">View All</Link>
        </div>
        {recent.length === 0 ? (
          <p className="empty-state">No applications yet. <Link to="/placements/new">Add your first application</Link></p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((app) => (
                  <tr key={app.id}>
                    <td>{app.companyName}</td>
                    <td>{app.jobRole}</td>
                    <td><span className={`badge ${app.status === 'OFFERED' ? 'badge-success' : 'badge-info'}`}>{app.status.replace(/_/g, ' ')}</span></td>
                    <td>{formatDate(app.applicationDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
