import React, { useState, FormEvent } from 'react';
import { Plus, X } from 'lucide-react';
import { CreateTaskData } from '../../types';
import './TaskForm.css';

interface TaskFormProps {
  onSubmit: (taskData: CreateTaskData) => Promise<boolean>;
  isLoading: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, isLoading }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    const success = await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined
    });

    if (success) {
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <div className="task-form-collapsed">
        <button
          onClick={() => setIsExpanded(true)}
          className="expand-button"
          disabled={isLoading}
        >
          <Plus size={20} />
          <span>Ajouter une nouvelle tâche</span>
        </button>
      </div>
    );
  }

  return (
    <div className="task-form-expanded">
      <div className="form-header">
        <h3>Nouvelle tâche</h3>
        <button
          onClick={handleCancel}
          className="close-button"
          disabled={isLoading}
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la tâche *"
            className="title-input"
            disabled={isLoading}
            autoFocus
          />
        </div>

        <div className="form-group">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optionnelle)"
            className="description-input"
            rows={4}
            disabled={isLoading}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={!title.trim() || isLoading}
          >
            {isLoading ? 'Création...' : 'Créer la tâche'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-button"
            disabled={isLoading}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;