export interface User {
  id: number;
  username: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  username: string;
}