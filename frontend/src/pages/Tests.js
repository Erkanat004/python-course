import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TestTube, Clock, Target, Users, Search, Play } from 'lucide-react';
import { api } from '../services/api';
import './Tests.css';

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tests/');
      if (response.data.success) {
        setTests(response.data.data);
      } else {
        setError('Ошибка при загрузке тестов');
      }
    } catch (err) {
      setError('Ошибка при загрузке тестов');
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter(test =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimeLimit = (minutes) => {
    if (minutes < 60) {
      return `${minutes} мин`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}ч ${remainingMinutes}м` : `${hours}ч`;
  };

  const getDifficultyColor = (questionsCount) => {
    if (questionsCount <= 5) return 'green';
    if (questionsCount <= 10) return 'yellow';
    return 'red';
  };

  const getDifficultyText = (questionsCount) => {
    if (questionsCount <= 5) return 'Легкий';
    if (questionsCount <= 10) return 'Средний';
    return 'Сложный';
  };

  if (loading) {
    return (
      <div className="tests">
        <div className="loading">
          <div className="spinner"></div>
          Загрузка тестов...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tests">
        <div className="alert alert-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="tests">
      {/* Header */}
      <div className="tests-header">
        <div className="tests-header-content">
          <div className="tests-title-section">
            <h1 className="tests-title">
              <TestTube size={32} />
              Тесты по Python
            </h1>
            <p className="tests-description">
              Проверьте свои знания Python с помощью интерактивных тестов разной сложности
            </p>
          </div>
          <div className="tests-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Поиск тестов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="tests-stats">
        <div className="stat-item">
          <div className="stat-icon">
            <TestTube size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{tests.length}</div>
            <div className="stat-label">Всего тестов</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {tests.reduce((total, test) => total + test.questions_count, 0)}
            </div>
            <div className="stat-label">Вопросов</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {Math.round(tests.reduce((total, test) => total + test.time_limit, 0) / tests.length)} мин
            </div>
            <div className="stat-label">Среднее время</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {tests.reduce((total, test) => total + (test.passing_score || 70), 0) / tests.length}%
            </div>
            <div className="stat-label">Проходной балл</div>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      {filteredTests.length === 0 ? (
        <div className="empty-state">
          <TestTube size={48} />
          <h3>Тесты не найдены</h3>
          <p>Попробуйте изменить поисковый запрос</p>
        </div>
      ) : (
        <div className="tests-grid">
          {filteredTests.map((test, index) => (
            <div key={test.id} className="test-card">
              <div className="test-card-header">
                <div className="test-badge">
                  <div className={`difficulty-badge difficulty-${getDifficultyColor(test.questions_count)}`}>
                    {getDifficultyText(test.questions_count)}
                  </div>
                </div>
                <div className="test-meta">
                  <div className="test-time">
                    <Clock size={14} />
                    {formatTimeLimit(test.time_limit)}
                  </div>
                </div>
              </div>
              
              <div className="test-card-body">
                <h3 className="test-title">{test.title}</h3>
                <p className="test-description">
                  {test.description || 'Описание отсутствует'}
                </p>
                
                <div className="test-stats">
                  <div className="test-stat">
                    <Target size={16} />
                    <span>{test.questions_count} вопросов</span>
                  </div>
                  <div className="test-stat">
                    <Target size={16} />
                    <span>Проходной балл: {test.passing_score}%</span>
                  </div>
                </div>
              </div>
              
              <div className="test-card-footer">
                <Link 
                  to={`/tests/${test.id}`} 
                  className="test-link"
                >
                  <Play size={16} />
                  Начать тест
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="tests-cta">
        <div className="cta-content">
          <h3>Готовы проверить знания?</h3>
          <p>Выберите тест и начните проверку своих навыков программирования</p>
          <Link to="/lectures" className="btn btn-secondary">
            Изучить лекции
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Tests;
