import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { BarChart3, Users, BookOpen, TestTube, LogOut, Plus, Edit, Trash2, UserCheck, UserX, Eye, Settings } from 'lucide-react';
import AddLectureForm from '../components/AddLectureForm';
import AddTestForm from '../components/AddTestForm';
import './Admin.css';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lectures, setLectures] = useState([]);
  const [tests, setTests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showAddLecture, setShowAddLecture] = useState(false);
  const [showAddTest, setShowAddTest] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadStats();
    loadLectures();
    loadTests();
    loadUsers();
  }, []);

  const checkAuth = () => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(savedUser);
    if (!userData.is_admin) {
      navigate('/');
      return;
    }

    setUser(userData);
  };


  const handleLectureCreated = (newLecture) => {
    setLectures(prev => [...prev, newLecture]);
    setShowAddLecture(false);
  };

  const handleTestCreated = (newTest) => {
    setTests(prev => [...prev, newTest]);
    setShowAddTest(false);
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError('Ошибка загрузки статистики');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const loadLectures = async () => {
    try {
      const response = await api.get('/lectures');
      if (response.data.success) {
        setLectures(response.data.data);
      }
    } catch (err) {
      console.error('Error loading lectures:', err);
    }
  };

  const loadTests = async () => {
    try {
      const response = await api.get('/tests');
      if (response.data.success) {
        setTests(response.data.data);
      }
    } catch (err) {
      console.error('Error loading tests:', err);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      if (response.data.success) {
        setAllUsers(response.data.data);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      // Fallback to mock data if API fails
      setAllUsers([
        { id: 1, username: 'admin_E', email: 'admin@example.com', is_admin: true, created_at: '2024-01-01' },
        { id: 2, username: 'user1', email: 'user1@example.com', is_admin: false, created_at: '2024-01-02' },
        { id: 3, username: 'user2', email: 'user2@example.com', is_admin: false, created_at: '2024-01-03' }
      ]);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Ошибка выхода:', err);
    } finally {
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const handlePromoteUser = async (userId) => {
    try {
      const response = await api.post(`/users/${userId}/promote`);
      if (response.data.success) {
        loadUsers(); // Перезагружаем список пользователей
        alert('Пользователь повышен до администратора');
      }
    } catch (err) {
      console.error('Ошибка повышения пользователя:', err);
      alert('Ошибка при повышении пользователя');
    }
  };

  const handleBanUser = async (userId) => {
    if (window.confirm('Вы уверены, что хотите заблокировать этого пользователя?')) {
      try {
        const response = await api.post(`/users/${userId}/ban`);
        if (response.data.success) {
          loadUsers(); // Перезагружаем список пользователей
          alert('Пользователь заблокирован');
        }
      } catch (err) {
        console.error('Ошибка блокировки пользователя:', err);
        alert('Ошибка при блокировке пользователя');
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title">
            <BarChart3 size={32} />
            <h1>Панель администратора</h1>
          </div>
        </div>
      </div>

      <div className="admin-content">
        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart3 size={18} />
            Дашборд
          </button>
          <button 
            className={`tab-button ${activeTab === 'lectures' ? 'active' : ''}`}
            onClick={() => setActiveTab('lectures')}
          >
            <BookOpen size={18} />
            Лекции
          </button>
          <button 
            className={`tab-button ${activeTab === 'tests' ? 'active' : ''}`}
            onClick={() => setActiveTab('tests')}
          >
            <TestTube size={18} />
            Тесты
          </button>
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            Пользователи
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <BookOpen size={24} />
                </div>
                <div className="stat-content">
                  <h3>Лекции</h3>
                  <p className="stat-number">{stats?.total_lectures || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <TestTube size={24} />
                </div>
                <div className="stat-content">
                  <h3>Тесты</h3>
                  <p className="stat-number">{stats?.total_tests || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <BarChart3 size={24} />
                </div>
                <div className="stat-content">
                  <h3>Вопросы</h3>
                  <p className="stat-number">{stats?.total_questions || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-content">
                  <h3>Пользователи</h3>
                  <p className="stat-number">{allUsers.length}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Lectures Tab */}
        {activeTab === 'lectures' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Управление лекциями</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddLecture(true)}
              >
                <Plus size={16} />
                Добавить лекцию
              </button>
            </div>
            <div className="content-list">
              {lectures.map((lecture) => (
                <div key={lecture.id} className="content-item">
                  <div className="content-info">
                    <h4>{lecture.title}</h4>
                    <p>{lecture.description}</p>
                    <span className="content-meta">Создано: {new Date(lecture.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="content-actions">
                    <button className="action-button view">
                      <Eye size={16} />
                      Просмотр
                    </button>
                    <button className="action-button edit">
                      <Edit size={16} />
                      Редактировать
                    </button>
                    <button className="action-button delete">
                      <Trash2 size={16} />
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tests Tab */}
        {activeTab === 'tests' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Управление тестами</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddTest(true)}
              >
                <Plus size={16} />
                Создать тест
              </button>
            </div>
            <div className="content-list">
              {tests.map((test) => (
                <div key={test.id} className="content-item">
                  <div className="content-info">
                    <h4>{test.title}</h4>
                    <p>{test.description}</p>
                    <div className="test-meta">
                      <span>Вопросов: {test.questions_count}</span>
                      <span>Время: {test.time_limit} мин</span>
                      <span>Проходной балл: {test.passing_score}%</span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button className="action-button view">
                      <Eye size={16} />
                      Просмотр
                    </button>
                    <button className="action-button edit">
                      <Edit size={16} />
                      Редактировать
                    </button>
                    <button className="action-button delete">
                      <Trash2 size={16} />
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Управление пользователями</h2>
            </div>
            <div className="users-list">
              {allUsers.map((user) => (
                <div key={user.id} className="user-item">
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <h4>{user.username}</h4>
                      <p>{user.email}</p>
                      <span className={`user-role ${user.is_admin ? 'admin' : 'user'}`}>
                        {user.is_admin ? 'Администратор' : 'Пользователь'}
                      </span>
                    </div>
                  </div>
                  <div className="user-actions">
                    <button className="action-button view">
                      <Eye size={16} />
                      Просмотр
                    </button>
                    {!user.is_admin && (
                      <>
                        <button 
                          className="action-button promote"
                          onClick={() => handlePromoteUser(user.id)}
                        >
                          <UserCheck size={16} />
                          Сделать админом
                        </button>
                        <button 
                          className="action-button ban"
                          onClick={() => handleBanUser(user.id)}
                        >
                          <UserX size={16} />
                          Заблокировать
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Statistics */}
        {activeTab === 'dashboard' && (
          <div className="admin-sections">
            <div className="admin-section">
              <div className="section-header">
                <h2>Статистика тестов</h2>
              </div>
              <div className="test-stats">
                {stats?.test_statistics?.map((test) => (
                  <div key={test.test_id} className="test-stat-item">
                    <div className="test-stat-header">
                      <h4>{test.test_title}</h4>
                      <span className="test-stat-badge">
                        {test.attempts} попыток
                      </span>
                    </div>
                    <div className="test-stat-metrics">
                      <div className="metric">
                        <span className="metric-label">Средний балл:</span>
                        <span className="metric-value">{test.average_score}%</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Процент прохождения:</span>
                        <span className="metric-value">{test.passing_rate}%</span>
                      </div>
                    </div>
                    <div className="test-stat-actions">
                      <button className="action-button edit">
                        <Edit size={16} />
                        Редактировать
                      </button>
                      <button className="action-button delete">
                        <Trash2 size={16} />
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-section">
              <div className="section-header">
                <h2>Быстрые действия</h2>
              </div>
              <div className="quick-actions">
                <button className="quick-action-button" onClick={() => setActiveTab('lectures')}>
                  <Plus size={20} />
                  <span>Добавить лекцию</span>
                </button>
                <button className="quick-action-button" onClick={() => setActiveTab('tests')}>
                  <Plus size={20} />
                  <span>Создать тест</span>
                </button>
                <button className="quick-action-button" onClick={() => setActiveTab('users')}>
                  <Users size={20} />
                  <span>Управление пользователями</span>
                </button>
                <button className="quick-action-button">
                  <BarChart3 size={20} />
                  <span>Просмотр отчетов</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Модальные окна */}
      {showAddLecture && (
        <AddLectureForm 
          onClose={() => setShowAddLecture(false)}
          onSuccess={handleLectureCreated}
        />
      )}

      {showAddTest && (
        <AddTestForm 
          onClose={() => setShowAddTest(false)}
          onSuccess={handleTestCreated}
        />
      )}
    </div>
  );
};

export default Admin;
