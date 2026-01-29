import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, AuthResponse, LoginData, Task, CreateTaskData, UpdateTaskData } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor pour ajouter automatiquement le token JWT
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor pour gérer les erreurs d'authentification
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Méthodes d'authentification
  async login(loginData: LoginData): Promise<ApiResponse<AuthResponse>> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.api.post('/auth/login', loginData);
    return response.data;
  }

  async verifyToken(): Promise<ApiResponse<{ user: any }>> {
    const response: AxiosResponse<ApiResponse<{ user: any }>> = await this.api.get('/auth/verify');
    return response.data;
  }

  // Méthodes pour les tâches
  async getTasks(): Promise<ApiResponse<Task[]>> {
    const response: AxiosResponse<ApiResponse<Task[]>> = await this.api.get('/tasks');
    return response.data;
  }

  async getTask(id: number): Promise<ApiResponse<Task>> {
    const response: AxiosResponse<ApiResponse<Task>> = await this.api.get(`/tasks/${id}`);
    return response.data;
  }

  async createTask(taskData: CreateTaskData): Promise<ApiResponse<Task>> {
    const response: AxiosResponse<ApiResponse<Task>> = await this.api.post('/tasks', taskData);
    return response.data;
  }

  async updateTask(id: number, updateData: UpdateTaskData): Promise<ApiResponse<Task>> {
    const response: AxiosResponse<ApiResponse<Task>> = await this.api.put(`/tasks/${id}`, updateData);
    return response.data;
  }

  async deleteTask(id: number): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.api.delete(`/tasks/${id}`);
    return response.data;
  }

  // Méthode pour tester la santé de l'API
  async healthCheck(): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get('/health');
    return response.data;
  }
}

const apiService = new ApiService();
export default apiService;