import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { formatDateTime, statusBadgeClass, getErrorMessage } from '../../utils/helpers';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, size: 10 });
      if (search) params.append('search', search);
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.data.content);
      setTotalPages(data.data.totalPages);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const viewUser = async (id) => {
    try {
      const { data } = await api.get(`/admin/users/${id}`);
      setSelectedUser(data.data);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their data?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>User Management</h1>
      </div>

      <div className="filters-bar">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-outline">Search</button>
        </form>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="admin-grid">
        <div className="card">
          {loading ? (
            <div className="loading-screen"><div className="spinner" /></div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td><span className="badge badge-primary">{user.role}</span></td>
                      <td><span className={`badge ${statusBadgeClass(user.online ? 'ONLINE' : 'OFFLINE')}`}>{user.online ? 'Online' : 'Offline'}</span></td>
                      <td>{formatDateTime(user.lastLogin)}</td>
                      <td className="actions-cell">
                        <button onClick={() => viewUser(user.id)} className="btn btn-outline btn-sm">View</button>
                        {user.role !== 'ADMIN' && (
                          <button onClick={() => deleteUser(user.id)} className="btn btn-danger btn-sm">Delete</button>
                        )}
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

        {selectedUser && (
          <div className="card user-detail-card">
            <h2>{selectedUser.name}</h2>
            <div className="info-list">
              <div className="info-item"><span className="info-label">Email</span><span>{selectedUser.email}</span></div>
              <div className="info-item"><span className="info-label">Phone</span><span>{selectedUser.phone || '—'}</span></div>
              <div className="info-item"><span className="info-label">College</span><span>{selectedUser.college || '—'}</span></div>
              <div className="info-item"><span className="info-label">Last Login</span><span>{formatDateTime(selectedUser.lastLogin)}</span></div>
              <div className="info-item"><span className="info-label">Status</span><span className={`badge ${statusBadgeClass(selectedUser.online ? 'ONLINE' : 'OFFLINE')}`}>{selectedUser.online ? 'Online' : 'Offline'}</span></div>
            </div>
            <h3>Placement Statistics</h3>
            <div className="mini-stats">
              <div><strong>{selectedUser.totalApplications}</strong> Total</div>
              <div><strong>{selectedUser.appliedCount}</strong> Applied</div>
              <div><strong>{selectedUser.shortlistedCount}</strong> Shortlisted</div>
              <div><strong>{selectedUser.interviewCount}</strong> Interviews</div>
              <div><strong>{selectedUser.offeredCount}</strong> Offers</div>
              <div><strong>{selectedUser.rejectedCount}</strong> Rejected</div>
            </div>
            <button onClick={() => setSelectedUser(null)} className="btn btn-outline btn-sm">Close</button>
          </div>
        )}
      </div>
    </Layout>
  );
}
