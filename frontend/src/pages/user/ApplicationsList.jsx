import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { APPLICATION_STATUSES, formatDate, statusBadgeClass, statusLabel, getErrorMessage } from '../../utils/helpers';

export default function ApplicationsList() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApps = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, size: 10 });
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      const { data } = await api.get(`/placements?${params}`);
      setApplications(data.data.content);
      setTotalPages(data.data.totalPages);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [page, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchApps();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await api.delete(`/placements/${id}`);
      fetchApps();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>My Applications</h1>
        <Link to="/placements/new" className="btn btn-primary">+ Add Application</Link>
      </div>

      <div className="filters-bar">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-outline">Search</button>
        </form>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }}>
          <option value="">All Statuses</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : applications.length === 0 ? (
          <p className="empty-state">No applications found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Package</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.companyName}</td>
                    <td>{app.jobRole}</td>
                    <td>{app.location || '—'}</td>
                    <td>{app.packageAmount ? `₹${app.packageAmount}` : '—'}</td>
                    <td><span className={`badge ${statusBadgeClass(app.status)}`}>{statusLabel(app.status)}</span></td>
                    <td>{formatDate(app.applicationDate)}</td>
                    <td className="actions-cell">
                      <Link to={`/placements/${app.id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                      <button onClick={() => handleDelete(app.id)} className="btn btn-danger btn-sm">Delete</button>
                    </td>
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
