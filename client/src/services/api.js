import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
})

// Attach JWT to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global response error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ─────────────────────────────────────────────────────
export const authAPI = {
  register: (data)  => api.post('/auth/register', data),
  login:    (data)  => api.post('/auth/login', data),
  me:       ()      => api.get('/auth/me'),
}

// ── Products ─────────────────────────────────────────────────
export const productAPI = {
  getAll:        (params) => api.get('/products', { params }),
  getById:       (id)     => api.get(`/products/${id}`),
  getBySeller:   (id)     => api.get(`/products/seller/${id}`),
  getCategories: ()       => api.get('/products/categories'),
  create:        (data)   => api.post('/products', data),           // data = FormData
  update:        (id, data) => api.put(`/products/${id}`, data),   // data = FormData
  delete:        (id)     => api.delete(`/products/${id}`),
}

// ── Reviews ──────────────────────────────────────────────────
export const reviewAPI = {
  getBySeller: (sellerId)       => api.get(`/reviews/seller/${sellerId}`),
  create:      (sellerId, data) => api.post(`/reviews/seller/${sellerId}`, data),
}

// ── Admin ────────────────────────────────────────────────────
export const adminAPI = {
  getStats:       ()           => api.get('/admin/stats'),
  getUsers:       (params)     => api.get('/admin/users', { params }),
  getProducts:    (params)     => api.get('/admin/products', { params }),
  banUser:        (id)         => api.patch(`/admin/users/${id}/ban`),
  unbanUser:      (id)         => api.patch(`/admin/users/${id}/unban`),
  deleteProduct:  (id)         => api.delete(`/admin/products/${id}`),
}

export default api
