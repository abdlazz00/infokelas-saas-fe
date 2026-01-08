import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://admin.infokelas.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR
 * Inject Bearer Token otomatis
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * Handle auth error global
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // Token invalid / expired
      if (status === 401 || status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Optional redirect
        // window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

/* =========================================================
   AUTH SERVICE
========================================================= */
export const authService = {
  login: async (identifier, password) => {
    const res = await api.post('/login', { identifier, password });
    return res.data;
  },

  logout: async () => {
    const res = await api.post('/logout');
    return res.data;
  },

  requestOtp: async (identifier) => {
    const res = await api.post('/forgot-password', { identifier });
    return res.data;
  },

  resetPassword: async (identifier, otp, newPassword) => {
    const res = await api.post('/reset-password', {
      identifier,
      otp,
      password: newPassword,
      password_confirmation: newPassword,
    });
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get('/profile');
    return res.data;
  },

  /**
   * Update Profile
   * ✅ SUPPORT multipart/form-data
   */
  updateProfile: async (formData) => {
    const res = await api.post('/profile/update', formData);
    return res.data;
  },
};

/* =========================================================
   CLASSROOM SERVICE
========================================================= */
export const classroomService = {
  getMyClasses: async () => {
    const res = await api.get('/classrooms');
    return res.data;
  },

  getClassDetail: async (id) => {
    const res = await api.get(`/classrooms/${id}`);
    return res.data;
  },

  joinClass: async (code) => {
    const res = await api.post('/join-class', { code });
    return res.data;
  },

  getSubjects: async (classroomId) => {
    const res = await api.get(`/classrooms/${classroomId}/subjects`);
    return res.data;
  },
};

/* =========================================================
   SCHEDULE SERVICE
========================================================= */
export const scheduleService = {
  getSchedules: async () => {
    const res = await api.get('/schedules');
    return res.data;
  },

  getTodaySchedules: async () => {
    const res = await api.get('/schedules?today=true');
    return res.data;
  },
};

/* =========================================================
   MATERIAL SERVICE
========================================================= */
export const materialService = {
  getBySubject: async (subjectId) => {
    const res = await api.get(`/materials?subject_id=${subjectId}`);
    return res.data;
  },

  getByClassroom: async (classroomId) => {
    const res = await api.get(`/classrooms/${classroomId}/materials`);
    return res.data;
  },

  getDetail: async (id) => {
    const res = await api.get(`/materials/${id}`);
    return res.data;
  },
};

/* =========================================================
   ASSIGNMENT SERVICE
========================================================= */
export const assignmentService = {
  getBySubject: async (subjectId) => {
    const res = await api.get(`/assignments?subject_id=${subjectId}`);
    return res.data;
  },

  getByClassroom: async (classroomId) => {
    const res = await api.get(`/classrooms/${classroomId}/assignments`);
    return res.data;
  },

  getDetail: async (id) => {
    const res = await api.get(`/assignments/${id}`);
    return res.data;
  },
};

/* =========================================================
   ANNOUNCEMENT SERVICE
========================================================= */
export const announcementService = {
  getActive: async (limit = 5) => {
    const res = await api.get(`/announcements?limit=${limit}`);
    return res.data;
  },
};

export default api;
