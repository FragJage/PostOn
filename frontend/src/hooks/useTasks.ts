import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskData, UpdateTaskData } from '../types';
import apiService from '../services/apiService';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getTasks();
      
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        setError(response.message || 'Erreur lors du chargement des tâches');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur de connexion');
      console.error('Erreur lors du chargement des tâches:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = async (taskData: CreateTaskData): Promise<boolean> => {
    try {
      const response = await apiService.createTask(taskData);
      
      if (response.success && response.data) {
        setTasks(prevTasks => [response.data!, ...prevTasks]);
        return true;
      } else {
        setError(response.message || 'Erreur lors de la création de la tâche');
        return false;
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur de connexion');
      console.error('Erreur lors de la création de la tâche:', error);
      return false;
    }
  };

  const updateTask = async (id: number, updateData: UpdateTaskData): Promise<boolean> => {
    try {
      const response = await apiService.updateTask(id, updateData);
      
      if (response.success && response.data) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === id ? response.data! : task
          )
        );
        return true;
      } else {
        setError(response.message || 'Erreur lors de la mise à jour de la tâche');
        return false;
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur de connexion');
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      return false;
    }
  };

  const deleteTask = async (id: number): Promise<boolean> => {
    try {
      const response = await apiService.deleteTask(id);
      
      if (response.success) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        return true;
      } else {
        setError(response.message || 'Erreur lors de la suppression de la tâche');
        return false;
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur de connexion');
      console.error('Erreur lors de la suppression de la tâche:', error);
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks,
    clearError
  };
};