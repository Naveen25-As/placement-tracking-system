import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { formatDateTime, statusBadgeClass, getErrorMessage } from '../../utils/helpers';

export default function LoginActivity() {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, size: 15 });
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);
      const { data } = await api.get(`/admin/login-activities?${params}`);
      setActivities(data.data.content);
      setTotalPages(data.data.totalPages);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [page, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchActivities();
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Login Activity</h1>
      </div>

      <div className="filters-bar filters-bar-wrap">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-outline">Search</button>
        </form>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }}>
          <option value="">All Statuses</option>
          <option value="ONLINE">Online</option>
          <option value="OFFLINE">Offline</option>
        </select>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} title="From date" />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} title="To date" />
        <button onClick={() => { setPage(0); fetchActivities(); }} className="btn btn-outline btn-sm">Apply Dates</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : activities.length === 0 ? (
          <p className="empty-state">No login activities found.</p>
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
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td>{activity.userName}</td>
                    <td>{activity.userEmail}</td>
                    <td>{formatDateTime(activity.loginTime)}</td>
                    <td>{formatDateTime(activity.logoutTime)}</td>
                    <td><span className={`badge ${statusBadgeClass(activity.status)}`}>{activity.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage(page - 1)} className="btn btn-outline btn-sm">Previous</button>
            <span>Page {page + 1} of {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="btn btn-outline btn-sm">Next</button>
          </div>
        )}
      </div>
    </Layout>
  );
}
