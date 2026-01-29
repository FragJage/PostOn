import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../hooks/useTasks';
import TaskForm from '../components/Tasks/TaskForm';
import TaskList from '../components/Tasks/TaskList';
import { LogOut, User, AlertCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
    clearError
  } = useTasks();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Post'On</h1>
            <p>Votre gestionnaire de tâches personnel</p>
          </div>
          
          <div className="header-user">
            <div className="user-info">
              <User size={20} />
              <span>Bonjour, {user?.username}!</span>
            </div>
            <button onClick={logout} className="logout-button" title="Déconnexion">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          {error && (
            <div className="error-banner">
              <AlertCircle size={20} />
              <span>{error}</span>
              <button onClick={clearError} className="error-close">
                ×
              </button>
            </div>
          )}

          <TaskForm onSubmit={createTask} isLoading={isLoading} />

          <TaskList
            tasks={tasks}
            onUpdate={updateTask}
            onDelete={deleteTask}
            isLoading={isLoading}
            onRefresh={refreshTasks}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;