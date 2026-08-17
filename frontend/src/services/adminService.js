import api from './api'

export const adminGetCompanies = () => api.get('/admin/companies').then((res) => res.data)
export const adminCreateCompany = (payload) => api.post('/admin/companies', payload).then((res) => res.data)
export const adminUpdateCompany = (id, payload) => api.put(`/admin/companies/${id}`, payload).then((res) => res.data)
export const adminDeleteCompany = (id) => api.delete(`/admin/companies/${id}`).then((res) => res.data)

export const adminGetJobs = () => api.get('/admin/jobs').then((res) => res.data)
export const adminCreateJob = (payload) => api.post('/admin/jobs', payload).then((res) => res.data)
export const adminUpdateJob = (id, payload) => api.put(`/admin/jobs/${id}`, payload).then((res) => res.data)
export const adminDeleteJob = (id) => api.delete(`/admin/jobs/${id}`).then((res) => res.data)

export const adminGetApplicationStats = () => api.get('/admin/stats/applications').then((res) => res.data)
