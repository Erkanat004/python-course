import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, TestTube, Home, Menu, X, LogIn, LogOut, User, Code } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigation = [
    { name: 'Главная', href: '/', icon: Home },
    { name: 'Лекции', href: '/lectures', icon: BookOpen },
    { name: 'Тесты', href: '/tests', icon: TestTube },
    { name: 'Компилятор', href: '/compiler', icon: Code },
  ];

  const isActive = (href) => location.pathname === href;

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-brand">
            <Link to="/" className="brand-link">
              <div className="brand-logo">
                🐍
              </div>
              <div className="brand-text">
                <span className="brand-title">Python Course</span>
                <span className="brand-subtitle">Учебный сайт по Python</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-link ${isActive(item.href) ? 'nav-link-active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Auth buttons */}
            <div className="auth-buttons">
              {user ? (
                <>
                  <Link to={user.is_admin ? "/admin" : "/"} className="nav-link user-link">
                    <User size={18} />
                    <span>{user.username}</span>
                    {user.is_admin && <span className="admin-badge">Админ</span>}
                  </Link>
                  <button onClick={handleLogout} className="nav-link logout-button">
                    <LogOut size={18} />
                    <span>Выйти</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link">
                    <LogIn size={18} />
                    <span>Войти</span>
                  </Link>
                  <Link to="/register" className="nav-link register-button">
                    <span>Регистрация</span>
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Открыть меню"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="nav-mobile">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-mobile-link ${isActive(item.href) ? 'nav-mobile-link-active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Mobile Auth buttons */}
            <div className="mobile-auth-buttons">
              {user ? (
                <>
                  <Link 
                    to={user.is_admin ? "/admin" : "/"} 
                    className="nav-mobile-link user-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>{user.username}</span>
                    {user.is_admin && <span className="admin-badge">Админ</span>}
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }} 
                    className="nav-mobile-link logout-button"
                  >
                    <LogOut size={18} />
                    <span>Выйти</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="nav-mobile-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn size={18} />
                    <span>Войти</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="nav-mobile-link register-button"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Регистрация</span>
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="main-container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="footer-logo">🐍</span>
              <span className="footer-title">Python Course</span>
            </div>
            <div className="footer-info">
              <p>Учебный сайт по программированию на Python</p>
              <p>Создан для изучения основ языка программирования</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Python Course. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
