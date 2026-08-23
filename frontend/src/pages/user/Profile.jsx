import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { formatDateTime, getErrorMessage } from '../../utils/helpers';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', college: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setProfile(data.data);
        setForm({
          name: data.data.name || '',
          phone: data.data.phone || '',
          college: data.data.college || '',
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      setProfile(data.data);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

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
        <h1>My Profile</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="profile-grid">
        <div className="card">
          <h2>Account Info</h2>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Email</span>
              <span>{profile?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role</span>
              <span className="badge badge-primary">{profile?.role}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Login</span>
              <span>{formatDateTime(profile?.lastLogin)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Member Since</span>
              <span>{formatDateTime(profile?.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="card form-card">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="college">College</label>
              <input id="college" name="college" value={form.college} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
