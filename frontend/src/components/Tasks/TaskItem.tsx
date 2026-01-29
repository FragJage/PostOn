import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types';
import { Edit2, Trash2, Check, Clock, Play, MoreVertical } from 'lucide-react';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: number, data: any) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getStatusInfo = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return { icon: Clock, color: 'pending', text: 'En attente' };
      case TaskStatus.IN_PROGRESS:
        return { icon: Play, color: 'in-progress', text: 'En cours' };
      case TaskStatus.COMPLETED:
        return { icon: Check, color: 'completed', text: 'Terminée' };
      default:
        return { icon: Clock, color: 'pending', text: 'En attente' };
    }
  };

  const statusInfo = getStatusInfo(task.status);
  const StatusIcon = statusInfo.icon;

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    
    setIsLoading(true);
    const success = await onUpdate(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined
    });
    
    if (success) {
      setIsEditing(false);
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setIsLoading(true);
    await onUpdate(task.id, { status: newStatus });
    setIsLoading(false);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      setIsLoading(true);
      await onDelete(task.id);
      setIsLoading(false);
    }
    setShowMenu(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`task-item ${statusInfo.color} ${isLoading ? 'loading' : ''}`}>
      <div className="task-status">
        <StatusIcon size={20} />
      </div>

      <div className="task-content">
        {isEditing ? (
          <div className="task-edit">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="edit-title"
              placeholder="Titre de la tâche"
              autoFocus
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="edit-description"
              placeholder="Description (optionnelle)"
              rows={3}
            />
            <div className="edit-actions">
              <button 
                onClick={handleSave}
                className="save-button"
                disabled={!editTitle.trim() || isLoading}
              >
                Sauvegarder
              </button>
              <button 
                onClick={handleCancel}
                className="cancel-button"
                disabled={isLoading}
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <div className="task-info">
            <h3 className="task-title">{task.title}</h3>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            <div className="task-meta">
              <span className={`task-badge ${statusInfo.color}`}>
                {statusInfo.text}
              </span>
              <span className="task-date">
                Créée le {formatDate(task.created_at)}
              </span>
            </div>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="task-actions">
          <div className="actions-menu">
            <button
              className="menu-button"
              onClick={() => setShowMenu(!showMenu)}
              disabled={isLoading}
            >
              <MoreVertical size={18} />
            </button>
            
            {showMenu && (
              <div className="menu-dropdown">
                <button onClick={() => setIsEditing(true)}>
                  <Edit2 size={16} />
                  Modifier
                </button>
                
                <div className="menu-section">
                  <span className="menu-label">Changer le statut</span>
                  {Object.values(TaskStatus).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={task.status === status ? 'active' : ''}
                    >
                      {getStatusInfo(status).text}
                    </button>
                  ))}
                </div>
                
                <button onClick={handleDelete} className="delete-action">
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay pour fermer le menu */}
      {showMenu && (
        <div 
          className="menu-overlay"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default TaskItem;