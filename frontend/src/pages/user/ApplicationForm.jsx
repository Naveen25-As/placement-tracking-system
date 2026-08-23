import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { APPLICATION_STATUSES, getErrorMessage } from '../../utils/helpers';

const emptyForm = {
  companyName: '',
  jobRole: '',
  location: '',
  packageAmount: '',
  applicationDate: new Date().toISOString().split('T')[0],
  status: 'APPLIED',
  interviewDate: '',
  notes: '',
};

export default function ApplicationForm({ editId = null, initialData = null }) {
  const [form, setForm] = useState(initialData || emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      ...form,
      packageAmount: form.packageAmount ? parseFloat(form.packageAmount) : null,
      interviewDate: form.interviewDate || null,
    };

    try {
      if (editId) {
        await api.put(`/placements/${editId}`, payload);
      } else {
        await api.post('/placements', payload);
      }
      navigate('/placements');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>{editId ? 'Edit Application' : 'Add Application'}</h1>
      </div>

      <div className="card form-card">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="companyName">Company Name *</label>
              <input id="companyName" name="companyName" value={form.companyName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="jobRole">Job Role *</label>
              <input id="jobRole" name="jobRole" value={form.jobRole} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input id="location" name="location" value={form.location} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="packageAmount">Package / Salary (LPA)</label>
              <input id="packageAmount" name="packageAmount" type="number" step="0.01" value={form.packageAmount} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="applicationDate">Application Date *</label>
              <input id="applicationDate" name="applicationDate" type="date" value={form.applicationDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select id="status" name="status" value={form.status} onChange={handleChange} required>
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="interviewDate">Interview Date</label>
              <input id="interviewDate" name="interviewDate" type="date" value={form.interviewDate} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" rows="4" value={form.notes} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/placements')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : editId ? 'Update Application' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
