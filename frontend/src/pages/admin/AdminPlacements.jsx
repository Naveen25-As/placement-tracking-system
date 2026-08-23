import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { APPLICATION_STATUSES, formatDate, statusBadgeClass, statusLabel, getErrorMessage } from '../../utils/helpers';

export default function AdminPlacements() {
  const [placements, setPlacements] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [company, setCompany] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, size: 10 });
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (company) params.append('company', company);
      const { data } = await api.get(`/admin/placements?${params}`);
      setPlacements(data.data.content);
      setTotalPages(data.data.totalPages);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, [page, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchPlacements();
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>All Placement Applications</h1>
      </div>

      <div className="filters-bar filters-bar-wrap">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search company, role, or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-outline">Search</button>
        </form>
        <input
          type="text"
          placeholder="Filter by company..."
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
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
        ) : placements.length === 0 ? (
          <p className="empty-state">No placement applications found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {placements.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div>{app.userName}</div>
                      <small className="text-muted">{app.userEmail}</small>
                    </td>
                    <td>{app.companyName}</td>
                    <td>{app.jobRole}</td>
                    <td>{app.location || '—'}</td>
                    <td><span className={`badge ${statusBadgeClass(app.status)}`}>{statusLabel(app.status)}</span></td>
                    <td>{formatDate(app.applicationDate)}</td>
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
