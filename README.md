# 🐍 Python Course - Учебный сайт по Python

Современная платформа для изучения программирования на Python с интерактивными лекциями и тестами.

## 🎯 Особенности

- 📚 **Интерактивные лекции** с примерами кода и объяснениями
- 🧩 **Тесты с проверкой знаний** разной сложности
- 📊 **Подробные результаты** с объяснениями правильных ответов
- 🎨 **Современный адаптивный интерфейс**
- ⚡ **Быстрый запуск** одной командой

## 🏗️ Архитектура

### Backend (Flask + SQLite)
- **API сервер** на Flask
- **База данных** SQLite для хранения лекций, тестов и результатов
- **RESTful API** для взаимодействия с frontend
- **CORS поддержка** для работы с React

### Frontend (React.js)
- **Современный UI** с использованием React 18
- **Адаптивный дизайн** для всех устройств
- **Markdown поддержка** для лекций
- **Подсветка синтаксиса** для кода

## 🚀 Быстрый запуск

### Автоматический запуск (рекомендуется)

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd python-course

# Запустите приложение одной командой
python3 app.py
```

Скрипт автоматически:
- ✅ Проверит версию Python
- 📦 Установит все зависимости
- 🚀 Запустит backend сервер (порт 5000)
- 🎨 Запустит frontend сервер (порт 3000)

### Ручной запуск

#### 1. Backend
```bash
cd backend
pip install -r requirements.txt
python3 app.py
```

#### 2. Frontend
```bash
cd frontend
npm install
npm start
```

## 📱 Доступ к приложению

После запуска приложение будет доступно по адресам:

- **Главная страница**: http://localhost:3000
- **Лекции**: http://localhost:3000/lectures
- **Тесты**: http://localhost:3000/tests
- **API**: http://localhost:5000/api

## 📚 Содержимое курса

### Лекции
1. **Введение в Python** - основы языка, синтаксис, переменные
2. **Типы данных** - числа, строки, списки, словари, кортежи
3. **Функции** - создание и использование функций

### Тесты
1. **Основы Python** - 5 вопросов, 15 минут
2. **Типы данных и функции** - 3 вопроса, 20 минут

## 🛠️ Разработка

### Структура проекта

```
python-course/
├── backend/                 # Flask API сервер
│   ├── app.py              # Главный файл приложения
│   ├── models.py           # Модели базы данных
│   ├── seed_data.py        # Начальные данные
│   ├── routes/             # API маршруты
│   │   ├── lectures.py     # Лекции
│   │   ├── tests.py        # Тесты
│   │   └── admin.py        # Администрирование
│   └── requirements.txt    # Python зависимости
├── frontend/               # React приложение
│   ├── public/             # Статические файлы
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/          # Страницы приложения
│   │   ├── services/       # API сервисы
│   │   └── App.js          # Главный компонент
│   └── package.json        # Node.js зависимости
├── app.py                  # Скрипт запуска
└── README.md               # Документация
```

### Добавление новых лекций

Лекции можно добавлять через API или напрямую в базу данных:

```python
# Пример добавления лекции через API
import requests

lecture_data = {
    "title": "Название лекции",
    "description": "Описание лекции",
    "content": "# Содержимое в Markdown\n\n```python\nprint('Hello, World!')\n```",
    "order": 4
}

response = requests.post('http://localhost:5000/api/lectures/', json=lecture_data)
```

### Добавление новых тестов

```python
# Пример добавления теста
test_data = {
    "title": "Новый тест",
    "description": "Описание теста",
    "time_limit": 30,
    "passing_score": 70,
    "questions": [
        {
            "question_text": "Вопрос?",
            "option_a": "Вариант A",
            "option_b": "Вариант B",
            "option_c": "Вариант C",
            "option_d": "Вариант D",
            "correct_answer": "A",
            "explanation": "Объяснение ответа"
        }
    ]
}

response = requests.post('http://localhost:5000/api/tests/', json=test_data)
```

## 🔧 Настройка

### Переменные окружения

Создайте файл `.env` в папке `frontend`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Изменение портов

- **Backend порт**: измените в `backend/app.py` (строка 79)
- **Frontend порт**: измените в `frontend/package.json` (скрипт start)

## 📊 API Endpoints

### Лекции
- `GET /api/lectures/` - получить все лекции
- `GET /api/lectures/{id}` - получить лекцию по ID
- `POST /api/lectures/` - создать новую лекцию
- `PUT /api/lectures/{id}` - обновить лекцию
- `DELETE /api/lectures/{id}` - удалить лекцию

### Тесты
- `GET /api/tests/` - получить все тесты
- `GET /api/tests/{id}` - получить тест по ID
- `POST /api/tests/{id}/submit` - отправить ответы на тест
- `GET /api/tests/{id}/results` - получить результаты теста

## 🐛 Устранение неполадок

### Backend не запускается
```bash
# Проверьте версию Python
python3 --version

# Установите зависимости
cd backend
pip install -r requirements.txt

# Запустите напрямую
python3 app.py
```

### Frontend не запускается
```bash
# Проверьте версию Node.js
node --version
npm --version

# Установите зависимости
cd frontend
npm install

# Запустите напрямую
npm start
```

### Проблемы с CORS
Убедитесь, что в `backend/app.py` настроен CORS:
```python
CORS(app, origins=['http://localhost:3000'])
```

## 📝 Лицензия

Этот проект создан в учебных целях. Используйте и модифицируйте по своему усмотрению.

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📞 Поддержка

Если у вас возникли вопросы или проблемы:
1. Проверьте раздел "Устранение неполадок"
2. Создайте Issue в репозитории
3. Обратитесь к документации Flask и React

---

**Удачного изучения Python! 🐍✨**
