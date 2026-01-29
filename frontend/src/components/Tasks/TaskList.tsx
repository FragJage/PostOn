import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types';
import TaskItem from './TaskItem';
import { Filter, Search, RotateCcw } from 'lucide-react';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: number, data: any) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  isLoading: boolean;
  onRefresh: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onUpdate,
  onDelete,
  isLoading,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || task.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  const taskCounts = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
    in_progress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminées';
      default: return 'Toutes';
    }
  };

  return (
    <div className="task-list">
      <div className="task-list-header">
        <div className="task-stats">
          <div className="stat-item">
            <span className="stat-number">{taskCounts.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item pending">
            <span className="stat-number">{taskCounts.pending}</span>
            <span className="stat-label">En attente</span>
          </div>
          <div className="stat-item in-progress">
            <span className="stat-number">{taskCounts.in_progress}</span>
            <span className="stat-label">En cours</span>
          </div>
          <div className="stat-item completed">
            <span className="stat-number">{taskCounts.completed}</span>
            <span className="stat-label">Terminées</span>
          </div>
        </div>

        <div className="task-controls">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher des tâches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-container">
            <Filter size={18} className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
              className="filter-select"
            >
              <option value="all">Toutes les tâches</option>
              <option value={TaskStatus.PENDING}>En attente</option>
              <option value={TaskStatus.IN_PROGRESS}>En cours</option>
              <option value={TaskStatus.COMPLETED}>Terminées</option>
            </select>
          </div>

          <button
            onClick={onRefresh}
            className="refresh-button"
            disabled={isLoading}
            title="Actualiser"
          >
            <RotateCcw size={18} className={isLoading ? 'spinning' : ''} />
          </button>
        </div>
      </div>

      <div className="task-list-content">
        {isLoading && tasks.length === 0 ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Chargement des tâches...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            {searchTerm || statusFilter !== 'all' ? (
              <div>
                <h3>Aucune tâche trouvée</h3>
                <p>
                  Aucune tâche ne correspond à votre recherche
                  {statusFilter !== 'all' && ` dans "${getStatusLabel(statusFilter)}"`}.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="clear-filters-button"
                >
                  Effacer les filtres
                </button>
              </div>
            ) : (
              <div>
                <h3>Aucune tâche pour le moment</h3>
                <p>Commencez par créer votre première tâche!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="tasks-container">
            {filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;