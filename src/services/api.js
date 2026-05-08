import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const OWNER_WHATSAPP_NUMBER =
  import.meta.env.VITE_OWNER_WHATSAPP || '6235745515';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('niora_admin_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      // Token invalid — clear it
      localStorage.removeItem('niora_admin_token');
    }
    return Promise.reject(err);
  }
);

// ---------- Public ----------
export const fetchProducts = (params = {}) =>
  api.get('/products/', { params }).then((r) => r.data);

export const fetchProduct = (slug) =>
  api.get(`/products/${slug}/`).then((r) => r.data);

export const fetchCategories = () =>
  api.get('/categories/').then((r) => r.data);

export const submitOrder = (payload) =>
  api.post('/orders/', payload).then((r) => r.data);

export const submitEnquiry = (payload) =>
  api.post('/enquiries/', payload).then((r) => r.data);

// ---------- Admin auth ----------
export const adminLogin = (username, password) =>
  api.post('/auth/login/', { username, password }).then((r) => r.data);

export const adminLogout = () =>
  api.post('/auth/logout/').then((r) => r.data);

export const adminMe = () =>
  api.get('/auth/me/').then((r) => r.data);

// ---------- Admin endpoints ----------
export const fetchAllProductsAdmin = (params = {}) =>
  api.get('/products/', { params }).then((r) => r.data);

export const createProduct = (data) => {
  // data may be FormData (with image) or plain object
  const isFormData = data instanceof FormData;
  return api
    .post('/products/', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    .then((r) => r.data);
};

export const updateProduct = (slug, data) => {
  const isFormData = data instanceof FormData;
  return api
    .patch(`/products/${slug}/`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    .then((r) => r.data);
};

export const deleteProduct = (slug) =>
  api.delete(`/products/${slug}/`).then((r) => r.data);

export const adjustStock = (slug, delta) =>
  api.post(`/products/${slug}/adjust_stock/`, { delta }).then((r) => r.data);

export const fetchOrders = (params = {}) =>
  api.get('/orders/', { params }).then((r) => r.data);

export const updateOrderStatus = (id, status) =>
  api.post(`/orders/${id}/mark_status/`, { status }).then((r) => r.data);

export const fetchEnquiries = (params = {}) =>
  api.get('/enquiries/', { params }).then((r) => r.data);

export const updateEnquiryStatus = (id, status) =>
  api.post(`/enquiries/${id}/mark_status/`, { status }).then((r) => r.data);

export const fetchDashboardStats = () =>
  api.get('/dashboard/stats/').then((r) => r.data);

export const createCategory = (data) =>
  api.post('/categories/', data).then((r) => r.data);

export const deleteCategory = (slug) =>
  api.delete(`/categories/${slug}/`).then((r) => r.data);

export default api;
