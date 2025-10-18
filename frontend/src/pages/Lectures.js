import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, Search, Filter } from 'lucide-react';
import { api } from '../services/api';
import './Lectures.css';

const Lectures = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const response = await api.get('/lectures/');
      if (response.data.success) {
        setLectures(response.data.data);
      } else {
        setError('Ошибка при загрузке лекций');
      }
    } catch (err) {
      setError('Ошибка при загрузке лекций');
      console.error('Error fetching lectures:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLectures = lectures.filter(lecture =>
    lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lecture.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="lectures">
        <div className="loading">
          <div className="spinner"></div>
          Загрузка лекций...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lectures">
        <div className="alert alert-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="lectures">
      {/* Header */}
      <div className="lectures-header">
        <div className="lectures-header-content">
          <div className="lectures-title-section">
            <h1 className="lectures-title">
              <BookOpen size={32} />
              Лекции по Python
            </h1>
            <p className="lectures-description">
              Изучайте программирование на Python с помощью подробных лекций и примеров кода
            </p>
          </div>
          <div className="lectures-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Поиск лекций..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="lectures-stats">
        <div className="stat-item">
          <div className="stat-number">{lectures.length}</div>
          <div className="stat-label">Всего лекций</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {lectures.reduce((total, lecture) => total + (lecture.content?.length || 0), 0).toLocaleString()}
          </div>
          <div className="stat-label">Символов контента</div>
        </div>
      </div>

      {/* Lectures Grid */}
      {filteredLectures.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} />
          <h3>Лекции не найдены</h3>
          <p>Попробуйте изменить поисковый запрос</p>
        </div>
      ) : (
        <div className="lectures-grid">
          {filteredLectures.map((lecture, index) => (
            <div key={lecture.id} className="lecture-card">
              <div className="lecture-card-header">
                <div className="lecture-number">
                  {String(lecture.order || index + 1).padStart(2, '0')}
                </div>
                <div className="lecture-meta">
                  <div className="lecture-date">
                    <Clock size={14} />
                    {new Date(lecture.created_at).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>
              
              <div className="lecture-card-body">
                <h3 className="lecture-title">{lecture.title}</h3>
                <p className="lecture-description">
                  {lecture.description || 'Описание отсутствует'}
                </p>
                
                <div className="lecture-stats">
                  <div className="lecture-stat">
                    <span className="stat-label">Длина:</span>
                    <span className="stat-value">
                      {Math.round((lecture.content?.length || 0) / 1000)}k символов
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="lecture-card-footer">
                <Link 
                  to={`/lectures/${lecture.id}`} 
                  className="lecture-link"
                >
                  Читать лекцию
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="lectures-cta">
        <div className="cta-content">
          <h3>Готовы начать обучение?</h3>
          <p>Выберите лекцию и начните изучение Python прямо сейчас</p>
          <Link to="/tests" className="btn btn-primary">
            Перейти к тестам
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Lectures;
