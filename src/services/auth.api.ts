
import axios from 'axios';

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthAPI = axios.create({
  baseURL: `${AUTH_BASE_URL}/api/auth`,
  timeout: 10000,
});

// Intercepteur pour les requêtes
AuthAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Types Auth
export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: string;
  nom: string;
  prenom?: string;
  email: string;
  role: 'admin' | 'client';
  dateCreation: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  telephone?: string;
  genre?: 'homme' | 'femme' | 'autre';
  passwordUnique?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  email: string;
  password: string;
}

export interface UpdateProfileData {
  nom?: string;
  prenom?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  telephone?: string;
  genre?: 'homme' | 'femme' | 'autre';
}

// Services d'authentification
export const authAPI = {
  login: (data: LoginData) => AuthAPI.post<AuthResponse>('/login', data),
  register: (data: RegisterData) => AuthAPI.post<AuthResponse>('/register', data),
  forgotPassword: (email: string) => AuthAPI.post('/forgot-password', { email }),
  resetPassword: (data: any) => AuthAPI.post('/reset-password', data),
  verifyToken: () => AuthAPI.get('/verify-token'),
  checkEmail: (email: string) => AuthAPI.post('/check-email', { email }),
  updateProfile: (userId: string, data: UpdateProfileData) => AuthAPI.put(`/users/${userId}`, data),
  updatePassword: (userId: string, currentPassword: string, newPassword: string) => 
    AuthAPI.put(`/users/${userId}/password`, { currentPassword, newPassword }),
  resetPasswordWithTempCode: (userId: string, passwordUnique: string, newPassword: string) =>
    AuthAPI.put(`/users/${userId}/password`, { passwordUnique, newPassword }),
  getUserProfile: (userId: string) => AuthAPI.get(`/users/${userId}`),
  verifyPassword: (userId: string, password: string) => 
    AuthAPI.post(`/users/${userId}/verify-password`, { password }),
  setTempPassword: (userId: string, passwordUnique: string) =>
    AuthAPI.put(`/users/${userId}/temp-password`, { passwordUnique }),
};
