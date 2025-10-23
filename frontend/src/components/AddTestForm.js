import React, { useState } from 'react';
import { X, Save, TestTube, Plus, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import './AddTestForm.css';

const AddTestForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time_limit: 30,
    passing_score: 70,
    is_active: true
  });
  const [questions, setQuestions] = useState([
    {
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
      explanation: '',
      order: 1
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
      explanation: '',
      order: questions.length + 1
    }]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      // Обновляем порядок
      newQuestions.forEach((q, i) => {
        q.order = i + 1;
      });
      setQuestions(newQuestions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Валидация
    if (!formData.title.trim()) {
      setError('Название теста обязательно');
      setLoading(false);
      return;
    }

    if (questions.some(q => !q.question_text.trim())) {
      setError('Все вопросы должны иметь текст');
      setLoading(false);
      return;
    }

    try {
      // Сначала создаем тест
      const testResponse = await api.post('/tests', formData);
      
      if (testResponse.data.success) {
        const testId = testResponse.data.data.id;
        
        // Затем добавляем вопросы
        for (const question of questions) {
          await api.post(`/admin/questions/${testId}`, question);
        }
        
        onSuccess(testResponse.data.data);
        onClose();
      } else {
        setError(testResponse.data.error || 'Ошибка при создании теста');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <div className="modal-title">
            <TestTube size={20} />
            <h2>Создать тест</h2>
          </div>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="test-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Основная информация о тесте */}
          <div className="form-section">
            <h3>Основная информация</h3>
            
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Название теста *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Введите название теста"
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
                placeholder="Описание теста"
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="time_limit" className="form-label">
                  Время выполнения (минуты)
                </label>
                <input
                  type="number"
                  id="time_limit"
                  name="time_limit"
                  value={formData.time_limit}
                  onChange={handleChange}
                  className="form-input"
                  min="1"
                  max="180"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="passing_score" className="form-label">
                  Проходной балл (%)
                </label>
                <input
                  type="number"
                  id="passing_score"
                  name="passing_score"
                  value={formData.passing_score}
                  onChange={handleChange}
                  className="form-input"
                  min="1"
                  max="100"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Тест активен</span>
              </label>
            </div>
          </div>

          {/* Вопросы */}
          <div className="form-section">
            <div className="section-header">
              <h3>Вопросы теста</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="btn btn-secondary"
                disabled={loading}
              >
                <Plus size={16} />
                Добавить вопрос
              </button>
            </div>

            {questions.map((question, index) => (
              <div key={index} className="question-card">
                <div className="question-header">
                  <h4>Вопрос {index + 1}</h4>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="btn btn-danger"
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Текст вопроса *</label>
                  <textarea
                    value={question.question_text}
                    onChange={(e) => handleQuestionChange(index, 'question_text', e.target.value)}
                    className="form-textarea"
                    placeholder="Введите текст вопроса"
                    rows={2}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="options-grid">
                  {['A', 'B', 'C', 'D'].map(option => (
                    <div key={option} className="form-group">
                      <label className="form-label">Вариант {option}</label>
                      <input
                        type="text"
                        value={question[`option_${option.toLowerCase()}`]}
                        onChange={(e) => handleQuestionChange(index, `option_${option.toLowerCase()}`, e.target.value)}
                        className="form-input"
                        placeholder={`Вариант ${option}`}
                        disabled={loading}
                      />
                    </div>
                  ))}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Правильный ответ</label>
                    <select
                      value={question.correct_answer}
                      onChange={(e) => handleQuestionChange(index, 'correct_answer', e.target.value)}
                      className="form-input"
                      disabled={loading}
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Объяснение</label>
                    <textarea
                      value={question.explanation}
                      onChange={(e) => handleQuestionChange(index, 'explanation', e.target.value)}
                      className="form-textarea"
                      placeholder="Объяснение правильного ответа"
                      rows={2}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            ))}
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
              {loading ? 'Создание...' : 'Создать тест'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestForm;
