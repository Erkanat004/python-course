import React, { useState } from 'react';
import { X, Save, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import './AddLectureForm.css';

const AddLectureForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    order: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/lectures', formData);
      
      if (response.data.success) {
        onSuccess(response.data.data);
        onClose();
      } else {
        setError(response.data.error || 'Ошибка при создании лекции');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <BookOpen size={20} />
            <h2>Добавить лекцию</h2>
          </div>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="lecture-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Название лекции *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Введите название лекции"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Краткое описание лекции"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Содержание лекции *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="form-textarea large"
              placeholder="Введите содержание лекции в формате Markdown"
              rows={15}
              required
              disabled={loading}
            />
            <div className="form-help">
              Поддерживается Markdown форматирование
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="order" className="form-label">
              Порядок отображения
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="form-input"
              placeholder="0"
              min="0"
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={16} />
              {loading ? 'Создание...' : 'Создать лекцию'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLectureForm;
