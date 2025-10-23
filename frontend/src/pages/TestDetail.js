import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import './TestDetail.css';

const TestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchTest();
    // Получаем информацию о пользователе
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setStudentName(userData.username);
    }
  }, [id]);

  useEffect(() => {
    let interval = null;
    if (timeLeft > 0 && startTime && !isSubmitted) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && startTime && !isSubmitted) {
      handleSubmit();
    }
    return () => clearInterval(interval);
  }, [timeLeft, startTime, isSubmitted]);

  const fetchTest = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tests/${id}`);
      if (response.data.success) {
        const testData = response.data.data;
        setTest(testData);
        setQuestions(testData.questions || []);
        setTimeLeft(testData.time_limit * 60); // конвертируем минуты в секунды
      } else {
        setError('Тест не найден');
      }
    } catch (err) {
      setError('Ошибка при загрузке теста');
      console.error('Error fetching test:', err);
    } finally {
      setLoading(false);
    }
  };

  const startTest = () => {
    if (!studentName.trim()) {
      alert('Пожалуйста, введите ваше имя');
      return;
    }
    setShowNameInput(false);
    setStartTime(Date.now());
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;

    setIsSubmitted(true);
    
    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      
      const response = await api.post(`/tests/${id}/submit`, {
        student_name: studentName,
        answers: answers,
        time_taken: timeTaken
      });

      if (response.data.success) {
        // Переходим на страницу результатов
        navigate(`/tests/${id}/result`, { 
          state: { 
            result: response.data.data,
            test: test,
            questions: questions
          }
        });
      } else {
        alert('Ошибка при отправке теста');
      }
    } catch (err) {
      console.error('Error submitting test:', err);
      alert('Ошибка при отправке теста');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const isQuestionAnswered = (questionId) => {
    return answers[questionId] !== undefined;
  };

  if (loading) {
    return (
      <div className="test-detail">
        <div className="loading">
          <div className="spinner"></div>
          Загрузка теста...
        </div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="test-detail">
        <div className="error-state">
          <AlertCircle size={48} />
          <h3>Тест не найден</h3>
          <p>{error || 'Запрашиваемый тест не существует'}</p>
          <button onClick={() => navigate('/tests')} className="btn btn-primary">
            Вернуться к тестам
          </button>
        </div>
      </div>
    );
  }

  if (showNameInput) {
    return (
      <div className="test-detail">
        <div className="test-start">
          <div className="test-start-content">
            <h1 className="test-title">{test.title}</h1>
            <p className="test-description">{test.description}</p>
            
            <div className="test-info">
              <div className="info-item">
                <Clock size={20} />
                <span>Время: {test.time_limit} минут</span>
              </div>
              <div className="info-item">
                <CheckCircle size={20} />
                <span>Вопросов: {test.questions_count}</span>
              </div>
              <div className="info-item">
                <AlertCircle size={20} />
                <span>Проходной балл: {test.passing_score}%</span>
              </div>
            </div>

            <div className="name-input-section">
              <label htmlFor="studentName" className="form-label">
                {user ? 'Ваше имя (из аккаунта):' : 'Введите ваше имя:'}
              </label>
              <input
                id="studentName"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="form-input"
                placeholder="Ваше имя"
                maxLength={100}
                disabled={user ? true : false}
              />
              {user && (
                <p className="name-note">
                  Имя взято из вашего аккаунта. Если хотите изменить, выйдите из аккаунта.
                </p>
              )}
            </div>

            <button 
              onClick={startTest}
              className="btn btn-primary btn-large"
            >
              Начать тест
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="test-detail">
        <div className="error-state">
          <AlertCircle size={48} />
          <h3>В тесте нет вопросов</h3>
          <p>Этот тест не содержит вопросов для прохождения</p>
          <button onClick={() => navigate('/tests')} className="btn btn-primary">
            Вернуться к тестам
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="test-detail">
      {/* Test Header */}
      <div className="test-header">
        <div className="test-header-content">
          <div className="test-info-header">
            <h1 className="test-title-header">{test.title}</h1>
            <div className="test-meta">
              <span className="question-counter">
                Вопрос {currentQuestion + 1} из {questions.length}
              </span>
              <span className="answered-counter">
                Отвечено: {getAnsweredCount()}/{questions.length}
              </span>
            </div>
          </div>
          
          <div className="time-display">
            <Clock size={20} />
            <span className={`time-text ${timeLeft < 300 ? 'time-warning' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="question-navigation">
        <div className="question-dots">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`question-dot ${index === currentQuestion ? 'active' : ''} ${isQuestionAnswered(questions[index].id) ? 'answered' : ''}`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question Content */}
      <div className="question-content">
        <div className="question-card">
          <div className="question-header">
            <h2 className="question-title">
              Вопрос {currentQuestion + 1}
            </h2>
          </div>
          
          <div className="question-body">
            <p className="question-text">{currentQ.question_text}</p>
            
            <div className="options">
              {['A', 'B', 'C', 'D'].map(option => {
                const optionText = currentQ[`option_${option.toLowerCase()}`];
                if (!optionText) return null;
                
                return (
                  <label 
                    key={option}
                    className={`option ${answers[currentQ.id] === option ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`question_${currentQ.id}`}
                      value={option}
                      checked={answers[currentQ.id] === option}
                      onChange={() => handleAnswerChange(currentQ.id, option)}
                    />
                    <span className="option-label">{option}.</span>
                    <span className="option-text">{optionText}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="test-controls">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="btn btn-secondary"
        >
          <ArrowLeft size={16} />
          Предыдущий
        </button>
        
        <div className="controls-center">
          <button
            onClick={handleSubmit}
            className="btn btn-success"
          >
            Завершить тест
          </button>
        </div>
        
        <button
          onClick={handleNext}
          disabled={currentQuestion === questions.length - 1}
          className="btn btn-secondary"
        >
          Следующий
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default TestDetail;
