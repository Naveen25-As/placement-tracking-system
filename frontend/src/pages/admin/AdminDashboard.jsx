import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { formatDateTime, statusBadgeClass, getErrorMessage } from '../../utils/helpers';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setDashboard(data.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
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
        <h1>Admin Dashboard</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {dashboard && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{dashboard.totalUsers}</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat-card stat-primary">
              <span className="stat-value">{dashboard.totalPlacements}</span>
              <span className="stat-label">Total Applications</span>
            </div>
            <div className="stat-card stat-success">
              <span className="stat-value">{dashboard.onlineUsers}</span>
              <span className="stat-label">Online Users</span>
            </div>
            <div className="stat-card stat-info">
              <span className="stat-value">{dashboard.totalLoginActivities}</span>
              <span className="stat-label">Login Activities</span>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Recent User Logins</h2>
            </div>
            {dashboard.recentLogins?.length === 0 ? (
              <p className="empty-state">No login activity yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Login Time</th>
                      <th>Logout Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.recentLogins.map((login) => (
                      <tr key={login.id}>
                        <td>{login.userName}</td>
                        <td>{login.userEmail}</td>
                        <td>{formatDateTime(login.loginTime)}</td>
                        <td>{formatDateTime(login.logoutTime)}</td>
                        <td><span className={`badge ${statusBadgeClass(login.status)}`}>{login.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
