export interface User {
  id: number;
  username: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  username: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  user_id: number;
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