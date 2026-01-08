import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.infokelas.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor untuk menyisipkan Token otomatis
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

// Interceptor untuk handle error global (misal: token expired / akun diarsipkan)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika 401 (Unauthorized) atau 403 (Forbidden/Arsip), logout paksa
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Opsional: Redirect ke login page jika menggunakan window.location
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login (Email/NIM)
  login: async (identifier, password) => {
    const response = await api.post('/login', { identifier, password });
    return response.data;
  },
  // Logout
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },
// 1. Request OTP (Kirim WA)
  requestOtp: async (identifier) => {
    const response = await api.post('/forgot-password', { identifier });
    return response.data;
  },

  resetPassword: async (identifier, otp, newPassword) => {
    const response = await api.post('/reset-password', { 
      identifier, 
      otp, 
      password: newPassword,
      password_confirmation: newPassword
    });
    return response.data;
  },

  // Get Profile
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  // Update Profile (Pakai FormData untuk upload gambar)
  updateProfile: async (formData) => {
    const response = await api.post('/profile/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const classroomService = {
  // List Kelas Saya
  getMyClasses: async () => {
    const response = await api.get('/classrooms');
    return response.data;
  },
  // Detail Kelas
  getClassDetail: async (id) => {
    const response = await api.get(`/classrooms/${id}`);
    return response.data;
  },
  // Gabung Kelas
  joinClass: async (code) => {
    const response = await api.post('/join-class', { code });
    return response.data;
  },
  // List Matkul dalam Kelas
  getSubjects: async (classroomId) => {
    const response = await api.get(`/classrooms/${classroomId}/subjects`);
    return response.data;
  },
};

export const scheduleService = {
  // Get Semua Jadwal
  getSchedules: async () => {
    const response = await api.get('/schedules');
    return response.data;
  },
  // Get Jadwal HARI INI (Fitur baru backend)
  getTodaySchedules: async () => {
    const response = await api.get('/schedules?today=true');
    return response.data;
  },
};

export const materialService = {
  // Get Materi by Subject
  getBySubject: async (subjectId) => {
    const response = await api.get(`/materials?subject_id=${subjectId}`);
    return response.data;
  },
  // Get Materi by Classroom (Semua materi di kelas)
  getByClassroom: async (classroomId) => {
    const response = await api.get(`/classrooms/${classroomId}/materials`);
    return response.data;
  },
  // Detail Materi
  getDetail: async (id) => {
    const response = await api.get(`/materials/${id}`);
    return response.data;
  },
};

export const assignmentService = {
  // Get Tugas by Subject
  getBySubject: async (subjectId) => {
    const response = await api.get(`/assignments?subject_id=${subjectId}`);
    return response.data;
  },
  // Get Tugas by Classroom
  getByClassroom: async (classroomId) => {
    const response = await api.get(`/classrooms/${classroomId}/assignments`);
    return response.data;
  },
  // Detail Tugas
  getDetail: async (id) => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },
};

export const announcementService = {
  // Get Pengumuman Aktif
  getActive: async (limit = 5) => {
    const response = await api.get(`/announcements?limit=${limit}`);
    return response.data;
  },
};

export default api;