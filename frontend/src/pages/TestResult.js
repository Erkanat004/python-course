import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Target, RotateCcw, Home, Award, TrendingUp } from 'lucide-react';
import './TestResult.css';

const TestResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (location.state) {
      setResult(location.state.result);
      setTest(location.state.test);
      setQuestions(location.state.questions);
    } else {
      // Если нет данных в state, перенаправляем на тесты
      navigate('/tests');
    }
  }, [location.state, navigate]);

  if (!result || !test) {
    return (
      <div className="test-result">
        <div className="loading">
          <div className="spinner"></div>
          Загрузка результатов...
        </div>
      </div>
    );
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 70) return 'good';
    if (percentage >= 50) return 'average';
    return 'poor';
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 90) return 'Отличная работа!';
    if (percentage >= 70) return 'Хороший результат!';
    if (percentage >= 50) return 'Неплохо, но есть куда расти!';
    return 'Попробуйте еще раз!';
  };

  const getScoreIcon = (percentage) => {
    if (percentage >= 70) return <Award size={24} />;
    return <TrendingUp size={24} />;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const retakeTest = () => {
    navigate(`/tests/${test.id}`);
  };

  const goHome = () => {
    navigate('/');
  };

  const goToTests = () => {
    navigate('/tests');
  };

  const scoreClass = getScoreColor(result.percentage);
  const passed = result.passed;

  return (
    <div className="test-result">
      {/* Result Header */}
      <div className={`result-header result-${scoreClass}`}>
        <div className="result-header-content">
          <div className="result-icon">
            {getScoreIcon(result.percentage)}
          </div>
          <div className="result-main">
            <h1 className="result-title">{getScoreMessage(result.percentage)}</h1>
            <p className="result-subtitle">
              {passed ? 'Вы прошли тест!' : 'Тест не пройден, но не расстраивайтесь!'}
            </p>
          </div>
        </div>
      </div>

      {/* Score Summary */}
      <div className="score-summary">
        <div className="score-card main-score">
          <div className="score-value">
            {result.percentage.toFixed(1)}%
          </div>
          <div className="score-label">Общий балл</div>
        </div>
        
        <div className="score-stats">
          <div className="score-stat">
            <div className="stat-icon">
              <Target size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{result.score}/{result.total_questions}</div>
              <div className="stat-label">Правильных ответов</div>
            </div>
          </div>
          
          <div className="score-stat">
            <div className="stat-icon">
              <Clock size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{formatTime(result.time_taken)}</div>
              <div className="stat-label">Время выполнения</div>
            </div>
          </div>
          
          <div className="score-stat">
            <div className="stat-icon">
              <CheckCircle size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{test.passing_score}%</div>
              <div className="stat-label">Проходной балл</div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Info */}
      <div className="test-info-card">
        <h2 className="test-info-title">{test.title}</h2>
        <p className="test-info-description">{test.description}</p>
        <div className="test-info-meta">
          <span className="test-meta-item">
            <Clock size={16} />
            Лимит времени: {test.time_limit} мин
          </span>
          <span className="test-meta-item">
            <Target size={16} />
            Вопросов: {test.questions_count}
          </span>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="detailed-results">
        <h2 className="detailed-title">Подробные результаты</h2>
        
        <div className="results-grid">
          {result.detailed_results.map((detail, index) => (
            <div key={index} className={`result-item ${detail.is_correct ? 'correct' : 'incorrect'}`}>
              <div className="result-item-header">
                <div className="result-item-number">
                  Вопрос {index + 1}
                </div>
                <div className="result-item-status">
                  {detail.is_correct ? (
                    <CheckCircle size={20} className="correct-icon" />
                  ) : (
                    <XCircle size={20} className="incorrect-icon" />
                  )}
                </div>
              </div>
              
              <div className="result-item-content">
                <p className="question-text">{detail.question_text}</p>
                
                <div className="answer-comparison">
                  <div className="answer-item">
                    <span className="answer-label">Ваш ответ:</span>
                    <span className={`answer-value ${detail.is_correct ? 'correct' : 'incorrect'}`}>
                      {detail.user_answer || 'Не отвечено'}
                    </span>
                  </div>
                  
                  {!detail.is_correct && (
                    <div className="answer-item">
                      <span className="answer-label">Правильный ответ:</span>
                      <span className="answer-value correct">
                        {detail.correct_answer}
                      </span>
                    </div>
                  )}
                </div>
                
                {detail.explanation && (
                  <div className="explanation">
                    <strong>Объяснение:</strong>
                    <p>{detail.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="result-actions">
        <button onClick={retakeTest} className="btn btn-primary">
          <RotateCcw size={16} />
          Пройти тест снова
        </button>
        
        <button onClick={goToTests} className="btn btn-secondary">
          Все тесты
        </button>
        
        <button onClick={goHome} className="btn btn-secondary">
          <Home size={16} />
          На главную
        </button>
      </div>

      {/* Motivation Message */}
      <div className={`motivation-message ${scoreClass}`}>
        <div className="motivation-content">
          {passed ? (
            <>
              <h3>Поздравляем! 🎉</h3>
              <p>
                Вы успешно прошли тест! Продолжайте изучать Python и не останавливайтесь на достигнутом.
              </p>
            </>
          ) : (
            <>
              <h3>Не расстраивайтесь! 💪</h3>
              <p>
                Каждая ошибка — это возможность научиться чему-то новому. 
                Изучите материал еще раз и попробуйте пройти тест заново.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestResult;
