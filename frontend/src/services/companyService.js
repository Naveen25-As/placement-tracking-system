import api from './api'

export const searchCompanies = (params = {}) =>
  api.get('/companies', { params }).then((res) => res.data)

export const getCompany = (id) => api.get(`/companies/${id}`).then((res) => res.data)
