import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      
      if (response.data.success) {
        const user = response.data.data;
        
        // Сохраняем информацию о пользователе в localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        // Перенаправляем в зависимости от роли
        if (user.is_admin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(response.data.error || 'Ошибка входа');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🐍</div>
          <h1 className="auth-title">Вход в систему</h1>
          <p className="auth-subtitle">Python Course</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Имя пользователя
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Введите имя пользователя"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Введите пароль"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Нет аккаунта?{' '}
            <Link to="/register" className="auth-link">
              Зарегистрироваться
            </Link>
          </p>
          <p>
            <Link to="/" className="auth-link">
              ← Вернуться на главную
            </Link>
          </p>
        </div>

        <div className="test-credentials">
          <h3>Тестовые данные:</h3>
          <p><strong>Администратор:</strong></p>
          <p>Логин: admin_E</p>
          <p>Пароль: admin041120</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

