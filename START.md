# 🚀 Быстрый запуск Python Course

## Простой способ запуска

```bash
# Перейдите в папку проекта
cd python-course

# Запустите одной командой
python3 app.py
```

## Что произойдет:

1. ✅ Проверка версии Python (требуется 3.7+)
2. 📦 Автоматическая установка всех зависимостей
3. 🚀 Запуск backend сервера (http://localhost:5000)
4. 🎨 Запуск frontend сервера (http://localhost:3000)

## Доступ к приложению:

- **Главная страница**: http://localhost:3000
- **Лекции**: http://localhost:3000/lectures  
- **Тесты**: http://localhost:3000/tests
- **API**: http://localhost:5000/api

## Требования:

- Python 3.7 или выше
- Node.js 14 или выше (для frontend)
- npm (устанавливается с Node.js)

## Если что-то не работает:

### Проблема с Python
```bash
python --version  # Должно быть 3.7+
```

### Проблема с Node.js
```bash
node --version   # Должно быть 14+
npm --version
```

### Ручной запуск:

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python3 app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## Структура проекта:

```
python-course/
├── app.py              # 🚀 Главный файл запуска
├── backend/            # 🐍 Flask API сервер
├── frontend/           # ⚛️ React приложение
└── README.md           # 📖 Подробная документация
```

## Готово! 🎉

После запуска откройте браузер и перейдите на http://localhost:3000

**Удачного изучения Python!** 🐍✨
