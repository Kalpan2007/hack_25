import axios from 'axios';
import { ApiResponse, PaginatedResponse, User, Question, Answer, Notification } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (username: string, email: string, password: string) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/api/auth/signup', {
      username,
      email,
      password,
    }),
  
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/api/auth/login', {
      email,
      password,
    }),
  
  getMe: () => api.get<ApiResponse<User>>('/api/auth/me'),
  
  updateProfile: (data: Partial<User>) =>
    api.put<ApiResponse<User>>('/api/auth/profile', data),
};

// Questions API
export const questionsAPI = {
  getQuestions: (params?: any) =>
    api.get<PaginatedResponse<Question>>('/api/questions', { params }),
  
  getQuestion: (id: string) =>
    api.get<ApiResponse<Question>>('/api/questions/' + id),
  
  createQuestion: (data: { title: string; body: string; tags: string[] }) =>
    api.post<ApiResponse<Question>>('/api/questions', data),
  
  updateQuestion: (id: string, data: { title: string; body: string; tags: string[] }) =>
    api.put<ApiResponse<Question>>('/api/questions/' + id, data),
  
  deleteQuestion: (id: string) =>
    api.delete('/api/questions/' + id),
  
  getTags: () => api.get<ApiResponse<string[]>>('/api/questions/tags'),
};

// Answers API
export const answersAPI = {
  createAnswer: (data: { body: string; questionId: string }) =>
    api.post<ApiResponse<Answer>>('/api/answers', data),
  
  updateAnswer: (id: string, data: { body: string }) =>
    api.put<ApiResponse<Answer>>('/api/answers/' + id, data),
  
  deleteAnswer: (id: string) =>
    api.delete('/api/answers/' + id),
  
  voteAnswer: (id: string, type: 'up' | 'down') =>
    api.post('/api/answers/' + id + '/vote', { type }),
  
  acceptAnswer: (id: string) =>
    api.post('/api/answers/' + id + '/accept'),
};

// Users API
export const usersAPI = {
  getUser: (id: string) =>
    api.get<ApiResponse<User>>('/api/users/' + id),
  
  getUserQuestions: (id: string) =>
    api.get<PaginatedResponse<Question>>('/api/users/' + id + '/questions'),
  
  getUserAnswers: (id: string) =>
    api.get<PaginatedResponse<Answer>>('/api/users/' + id + '/answers'),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: () =>
    api.get<PaginatedResponse<Notification>>('/api/notifications'),
  
  getUnreadCount: () =>
    api.get<ApiResponse<{ count: number }>>('/api/notifications/unread-count'),
  
  markAllAsRead: () =>
    api.put('/api/notifications/read-all'),
  
  markAsRead: (id: string) =>
    api.put('/api/notifications/' + id + '/read'),
  
  deleteNotification: (id: string) =>
    api.delete('/api/notifications/' + id),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<ApiResponse<{ url: string; publicId: string }>>('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteImage: (publicId: string) =>
    api.delete('/api/upload/image/' + publicId),
};

// Admin API
export const adminAPI = {
  getStats: () =>
    api.get<ApiResponse<any>>('/api/admin/stats'),
  
  getUsers: () =>
    api.get<PaginatedResponse<User>>('/api/admin/users'),
  
  getQuestions: () =>
    api.get<PaginatedResponse<Question>>('/api/admin/questions'),
  
  banUser: (id: string, banned: boolean) =>
    api.put('/api/admin/users/' + id + '/ban', { banned }),
  
  deleteQuestion: (id: string) =>
    api.delete('/api/admin/questions/' + id),
  
  deleteAnswer: (id: string) =>
    api.delete('/api/admin/answers/' + id),
};

export default api;