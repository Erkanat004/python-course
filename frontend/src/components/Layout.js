import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, TestTube, Home, Menu, X } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Главная', href: '/', icon: Home },
    { name: 'Лекции', href: '/lectures', icon: BookOpen },
    { name: 'Тесты', href: '/tests', icon: TestTube },
  ];

  const isActive = (href) => location.pathname === href;

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
