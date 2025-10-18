import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TestTube, Play, ArrowRight, Star, Users, Clock } from 'lucide-react';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Интерактивные лекции',
      description: 'Подробные лекции с примерами кода и объяснениями основных концепций Python',
      link: '/lectures',
      color: 'blue'
    },
    {
      icon: TestTube,
      title: 'Практические тесты',
      description: 'Проверьте свои знания с помощью тестов разной сложности',
      link: '/tests',
      color: 'green'
    },
    {
      icon: Play,
      title: 'Видео уроки',
      description: 'Визуальные материалы для лучшего понимания материала',
      link: '/videos',
      color: 'purple'
    }
  ];

  const stats = [
    { icon: BookOpen, label: 'Лекций', value: '10+' },
    { icon: TestTube, label: 'Тестов', value: '5+' },
    { icon: Users, label: 'Студентов', value: '100+' },
    { icon: Star, label: 'Рейтинг', value: '4.8' }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Изучайте <span className="text-gradient">Python</span> с нуля
            </h1>
            <p className="hero-description">
              Современный учебный курс по программированию на Python. 
              Изучайте основы языка, практикуйтесь на тестах и становитесь 
              настоящим Python-разработчиком!
            </p>
            <div className="hero-actions">
              <Link to="/lectures" className="btn btn-primary btn-large">
                Начать обучение
                <ArrowRight size={20} />
              </Link>
              <Link to="/tests" className="btn btn-secondary btn-large">
                Пройти тест
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="code-block">
              <div className="code-header">
                <div className="code-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="code-title">python.py</span>
              </div>
              <div className="code-content">
                <pre><code>{`# Добро пожаловать в Python!
def hello_world():
    print("Привет, мир!")

# Создаем список
fruits = ['яблоко', 'банан', 'апельсин']

# Цикл по списку
for fruit in fruits:
    print(f"Фрукт: {fruit}")

# Вызываем функцию
hello_world()`}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <Icon size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2 className="section-title">Что вас ждет</h2>
          <p className="section-description">
            Полноценный курс по изучению Python с практическими заданиями
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className={`feature-card feature-${feature.color}`}>
                <div className="feature-icon">
                  <Icon size={32} />
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <Link to={feature.link} className="feature-link">
                    Узнать больше
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Course Overview */}
      <section className="course-overview">
        <div className="course-content">
          <div className="course-text">
            <h2 className="course-title">
              Структурированное обучение
            </h2>
            <p className="course-description">
              Наш курс построен по принципу "от простого к сложному". 
              Каждая лекция дополняется практическими заданиями и тестами 
              для закрепления материала.
            </p>
            <div className="course-features">
              <div className="course-feature">
                <div className="course-feature-icon">
                  <Clock size={20} />
                </div>
                <span>Самостоятельное изучение в удобном темпе</span>
              </div>
              <div className="course-feature">
                <div className="course-feature-icon">
                  <BookOpen size={20} />
                </div>
                <span>Подробные лекции с примерами кода</span>
              </div>
              <div className="course-feature">
                <div className="course-feature-icon">
                  <TestTube size={20} />
                </div>
                <span>Интерактивные тесты для проверки знаний</span>
              </div>
            </div>
            <div className="course-actions">
              <Link to="/lectures" className="btn btn-primary">
                Начать с первой лекции
              </Link>
            </div>
          </div>
          <div className="course-visual">
            <div className="learning-path">
              <div className="path-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Основы Python</h4>
                  <p>Синтаксис, переменные, типы данных</p>
                </div>
              </div>
              <div className="path-connector"></div>
              <div className="path-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Функции и модули</h4>
                  <p>Создание функций, работа с модулями</p>
                </div>
              </div>
              <div className="path-connector"></div>
              <div className="path-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>ООП в Python</h4>
                  <p>Классы, объекты, наследование</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
