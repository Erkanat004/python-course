import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { api } from '../services/api';
import './LectureDetail.css';

const LectureDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState(null);
  const [allLectures, setAllLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);

  useEffect(() => {
    fetchLecture();
    fetchAllLectures();
  }, [id]);

  useEffect(() => {
    if (lecture && allLectures.length > 0) {
      const index = allLectures.findIndex(l => l.id === lecture.id);
      setCurrentLectureIndex(index);
    }
  }, [lecture, allLectures]);

  const fetchLecture = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/lectures/${id}`);
      if (response.data.success) {
        setLecture(response.data.data);
      } else {
        setError('Лекция не найдена');
      }
    } catch (err) {
      setError('Ошибка при загрузке лекции');
      console.error('Error fetching lecture:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLectures = async () => {
    try {
      const response = await api.get('/lectures/');
      if (response.data.success) {
        setAllLectures(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching all lectures:', err);
    }
  };

  const goToPreviousLecture = () => {
    if (currentLectureIndex > 0) {
      const prevLecture = allLectures[currentLectureIndex - 1];
      navigate(`/lectures/${prevLecture.id}`);
    }
  };

  const goToNextLectureWrite = () => {
    if (currentLectureIndex < allLectures.length - 1) {
      const nextLecture = allLectures[currentLectureIndex + 1];
      navigate(`/lectures/${nextLecture.id}`);
    }
  };

  const shareLecture = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: lecture.title,
          text: lecture.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Ссылка скопирована в буфер обмена!');
      } catch (err) {
        console.log('Error copying to clipboard:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="lecture-detail">
        <div className="loading">
          <div className="spinner"></div>
          Загрузка лекции...
        </div>
      </div>
    );
  }

  if (error || !lecture) {
    return (
      <div className="lecture-detail">
        <div className="error-state">
          <BookOpen size={48} />
          <h3>Лекция не найдена</h3>
          <p>{error || 'Запрашиваемая лекция не существует'}</p>
          <Link to="/lectures" className="btn btn-primary">
            <ArrowLeft size={16} />
            Вернуться к лекциям
          </Link>
        </div>
      </div>
    );
  }

  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    
    return !inline && match ? (
      <SyntaxHighlighter
        style={tomorrow}
        language={language}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  return (
    <div className="lecture-detail">
      {/* Navigation */}
      <div className="lecture-navigation">
        <Link to="/lectures" className="nav-link">
          <ArrowLeft size={18} />
          Все лекции
        </Link>
        
        <div className="lecture-progress">
          <span className="progress-text">
            Лекция {currentLectureIndex + 1} из {allLectures.length}
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentLectureIndex + 1) / allLectures.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Lecture Header */}
      <header className="lecture-header">
        <div className="lecture-header-content">
          <div className="lecture-meta">
            <div className="lecture-number">
              {String(lecture.order || currentLectureIndex + 1).padStart(2, '0')}
            </div>
            <div className="lecture-date">
              <Clock size={16} />
              {new Date(lecture.created_at).toLocaleDateString('ru-RU')}
            </div>
          </div>
          
          <h1 className="lecture-title">{lecture.title}</h1>
          
          {lecture.description && (
            <p className="lecture-description">{lecture.description}</p>
          )}
          
          <div className="lecture-actions">
            <button onClick={shareLecture} className="btn btn-secondary">
              <Share2 size={16} />
              Поделиться
            </button>
          </div>
        </div>
      </header>

      {/* Lecture Content */}
      <div className="lecture-content">
        <div className="content-wrapper">
          <ReactMarkdown
            components={{
              code: CodeBlock,
            }}
          >
            {lecture.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Navigation Footer */}
      <footer className="lecture-footer">
        <div className="lecture-footer-content">
          <button 
            onClick={goToPreviousLecture}
            disabled={currentLectureIndex === 0}
            className="btn btn-secondary"
          >
            <ChevronLeft size={16} />
            Предыдущая лекция
          </button>
          
          <Link to="/tests" className="btn btn-primary">
            Пройти тесты
          </Link>
          
          <button 
            onClick={goToNextLectureWrite}
            disabled={currentLectureIndex === allLectures.length - 1}
            className="btn btn-secondary"
          >
            Следующая лекция
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LectureDetail;
