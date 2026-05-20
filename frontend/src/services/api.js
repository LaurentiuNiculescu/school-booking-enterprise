import axios from 'axios'

const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password })
}

export const assetsApi = {
  getAll: () => api.get('/assets'),
  getById: (id) => api.get(`/assets/${id}`),
  getByQr: (qrCode) => api.get(`/assets/qr/${qrCode}`),
  create: (asset) => api.post('/assets', asset),
  update: (id, asset) => api.put(`/assets/${id}`, asset),
  delete: (id) => api.delete(`/assets/${id}`),
  checkout: (id, assignedTo) => api.post(`/assets/${id}/checkout`, { assignedTo }),
  checkin: (id) => api.post(`/assets/${id}/checkin`)
}

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats')
}

export const adminApi = {
  getSchools: () => api.get('/admin/schools'),
  createSchool: (s) => api.post('/admin/schools', s),
  getUsers: () => api.get('/admin/users'),
  createUser: (u) => api.post('/admin/users', u),
  resetUser: (id) => api.put(`/admin/users/${id}/reset`),
  toggleUser: (id, isActive) => api.put(`/admin/users/${id}/toggle`, { isActive })
}

export default api
