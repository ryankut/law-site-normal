import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { token } = response.data;
        
        localStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout', { refreshToken: localStorage.getItem('refreshToken') }),
  me: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
};

// Appointments
export const appointmentAPI = {
  getAvailableSlots: (date: string, duration?: number) =>
    api.get('/appointments/available-slots', { params: { date, duration } }),
  getAll: (params?: any) => api.get('/appointments', { params }),
  getMyAppointments: () => api.get('/appointments/my-appointments'),
  create: (data: any) => api.post('/appointments', data),
  update: (id: string, data: any) => api.put(`/appointments/${id}`, data),
  cancel: (id: string, reason?: string) =>
    api.post(`/appointments/${id}/cancel`, { reason }),
};

// Clients
export const clientAPI = {
  getAll: (params?: any) => api.get('/clients', { params }),
  getById: (id: string) => api.get(`/clients/${id}`),
  update: (id: string, data: any) => api.put(`/clients/${id}`, data),
};

// Cases
export const caseAPI = {
  getAll: (params?: any) => api.get('/cases', { params }),
  getFeatured: () => api.get('/cases/featured'),
  getById: (id: string) => api.get(`/cases/${id}`),
  create: (data: any) => api.post('/cases', data),
  update: (id: string, data: any) => api.put(`/cases/${id}`, data),
  addNote: (id: string, data: any) => api.post(`/cases/${id}/notes`, data),
  delete: (id: string) => api.delete(`/cases/${id}`),
};

// Payments
export const paymentAPI = {
  createConsultationPayment: (data: any) =>
    api.post('/payments/create-consultation-payment', data),
  createInvoice: (data: any) => api.post('/payments/create-invoice', data),
  getAll: (params?: any) => api.get('/payments', { params }),
  getMyPayments: () => api.get('/payments/my-payments'),
};



// Practice Areas
export const practiceAreaAPI = {
  getAll: () => api.get('/practice-areas'),
  getBySlug: (slug: string) => api.get(`/practice-areas/${slug}`),
  create: (data: any) => api.post('/practice-areas', data),
  update: (id: string, data: any) => api.put(`/practice-areas/${id}`, data),
  delete: (id: string) => api.delete(`/practice-areas/${id}`),
};

// Matter Types
export const matterTypeAPI = {
  getAll: (params?: any) => api.get('/matter-types', { params }),
  create: (data: any) => api.post('/matter-types', data),
  update: (id: string, data: any) => api.put(`/matter-types/${id}`, data),
  delete: (id: string) => api.delete(`/matter-types/${id}`),
};

// Team Members
export const teamMemberAPI = {
  getAll: () => api.get('/team-members'),
  getById: (id: string) => api.get(`/team-members/${id}`),
  create: (data: any) => api.post('/team-members', data),
  update: (id: string, data: any) => api.put(`/team-members/${id}`, data),
  delete: (id: string) => api.delete(`/team-members/${id}`),
  attachPracticeArea: (id: string, practiceAreaId: string) =>
    api.post(`/team-members/${id}/practice-areas`, { practiceAreaId }),
  detachPracticeArea: (id: string, practiceAreaId: string) =>
    api.delete(`/team-members/${id}/practice-areas/${practiceAreaId}`),
};

// FAQs
export const faqAPI = {
  getAll: (params?: any) => api.get('/faqs', { params }),
  create: (data: any) => api.post('/faqs', data),
  update: (id: string, data: any) => api.put(`/faqs/${id}`, data),
  delete: (id: string) => api.delete(`/faqs/${id}`),
};

// News Categories
export const newsCategoryAPI = {
  getAllAdmin: () => api.get('/news-categories'),
  create: (data: any) => api.post('/news-categories', data),
  update: (id: string, data: any) => api.put(`/news-categories/${id}`, data),
  delete: (id: string) => api.delete(`/news-categories/${id}`),
};

// News Articles
export const newsArticleAPI = {
  getAll: (params?: any) => api.get('/news-articles', { params }),
  getAllAdmin: () => api.get('/news-articles/admin/all'),
  getBySlug: (slug: string) => api.get(`/news-articles/${slug}`),
  create: (data: any) => api.post('/news-articles', data),
  update: (id: string, data: any) => api.put(`/news-articles/${id}`, data),
  delete: (id: string) => api.delete(`/news-articles/${id}`),
};

// Client Logos
export const clientLogoAPI = {
  getAll: () => api.get('/client-logos'),
  create: (data: any) => api.post('/client-logos', data),
  update: (id: string, data: any) => api.put(`/client-logos/${id}`, data),
  delete: (id: string) => api.delete(`/client-logos/${id}`),
};

// Resources
export const resourceAPI = {
  getAll: () => api.get('/resources'),
  create: (data: any) => api.post('/resources', data),
  update: (id: string, data: any) => api.put(`/resources/${id}`, data),
  delete: (id: string) => api.delete(`/resources/${id}`),
};

// Newsletter Subscribers
export const newsletterAPI = {
  getAll: () => api.get('/newsletter'),
  delete: (id: string) => api.delete(`/newsletter/${id}`),
};

// Contact Submissions
export const contactSubmissionAPI = {
  getAll: () => api.get('/contact'),
  markRead: (id: string) => api.put(`/contact/${id}/read`),
};

// Firm Settings (singleton — distinct from adminAPI.getSettings/updateSettings,
// which hits the older generic SiteSettings key-value model)
export const firmSettingsAPI = {
  get: () => api.get('/settings'),
  update: (data: any) => api.put('/settings', data),
};

// Documents
export const documentAPI = {
  getAll: (params?: any) => api.get('/documents', { params }),
  getTemplates: () => api.get('/documents/templates'),
  upload: (data: any) => api.post('/documents', data),
  delete: (id: string) => api.delete(`/documents/${id}`),
};

// Messages
export const messageAPI = {
  getAll: (params?: any) => api.get('/messages', { params }),
  getThread: (id: string) => api.get(`/messages/thread/${id}`),
  send: (data: any) => api.post('/messages', data),
  markAsRead: (id: string) => api.put(`/messages/${id}/read`),
};

// Admin
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAnalytics: (params?: any) => api.get('/admin/analytics', { params }),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.put('/admin/settings', data),
};

// Notifications
export const notificationAPI = {
  getAll: (params?: any) => api.get('/notifications', { params }),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

// File uploads
export const uploadAPI = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    // Content-Type must be unset (not just changed) here — this axios instance
    // defaults to 'application/json' globally, and setting it to undefined
    // lets the browser generate the correct multipart boundary itself.
    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': undefined },
    });
    // Backend returns a relative path like "/uploads/xyz.png" — resolve it
    // to an absolute URL immediately so every consumer of this value (admin
    // previews, and later the public site) can use it directly.
    return { ...res, data: { ...res.data, url: `${API_ORIGIN}${res.data.url}` } };
  },
};

export default api;
