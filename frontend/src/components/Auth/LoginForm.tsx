import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, User } from 'lucide-react';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Veuillez saisir un nom d\'utilisateur');
      return;
    }

    const success = await login({ username: username.trim() });
    
    if (!success) {
      setError('Erreur lors de la connexion. Veuillez réessayer.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <User size={48} />
          </div>
          <h1>Post'On</h1>
          <p>Votre gestionnaire de tâches simple et efficace</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading || !username.trim()}
          >
            {isLoading ? (
              <span>Connexion...</span>
            ) : (
              <>
                <LogIn size={20} />
                <span>Se connecter</span>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Saisissez simplement votre nom pour commencer!</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;