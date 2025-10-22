import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://python-course-zg1y-q4b19wsh1-erkanat004s-projects.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Можно добавить токен авторизации здесь
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Сервер ответил с ошибкой
      const { status, data } = error.response;
      
      if (status === 404) {
        console.error('Ресурс не найден:', data.message || 'Not Found');
      } else if (status >= 500) {
        console.error('Ошибка сервера:', data.message || 'Internal Server Error');
      } else {
        console.error('Ошибка клиента:', data.message || 'Client Error');
      }
    } else if (error.request) {
      // Запрос был отправлен, но ответ не получен
      console.error('Ошибка сети:', error.message);
    } else {
      // Что-то еще произошло
      console.error('Ошибка:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export { api };
