import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApplicationForm from './ApplicationForm';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { getErrorMessage } from '../../utils/helpers';

export default function EditApplication() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const { data } = await api.get(`/placements/${id}`);
        const app = data.data;
        setInitialData({
          companyName: app.companyName,
          jobRole: app.jobRole,
          location: app.location || '',
          packageAmount: app.packageAmount || '',
          applicationDate: app.applicationDate,
          status: app.status,
          interviewDate: app.interviewDate || '',
          notes: app.notes || '',
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="loading-screen"><div className="spinner" /></div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="alert alert-danger">{error}</div>
      </Layout>
    );
  }

  return <ApplicationForm editId={id} initialData={initialData} />;
}
