from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import sys
from datetime import datetime

# Добавляем текущую директорию в путь для импорта модулей
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__)
app.config['SECRET_KEY'] = 'python-course-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///python_course.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Настройка CORS для работы с React frontend
CORS(app)

# Импорт моделей (они создают db экземпляр)
from models import db, Lecture, Test, Question, TestResult, init_db

# Инициализация базы данных
init_db(app)

# Создание таблиц в базе данных
with app.app_context():
    db.create_all()

# Импорт маршрутов
from routes import lectures, tests, admin

# Регистрация blueprint'ов
app.register_blueprint(lectures.bp)
app.register_blueprint(tests.bp)
app.register_blueprint(admin.bp)

@app.route('/')
def index():
    """Главная страница API"""
    return jsonify({
        'message': 'Python Course API',
        'version': '1.0',
        'endpoints': {
            'lectures': '/api/lectures',
            'tests': '/api/tests',
            'admin': '/api/admin'
        }
    })

@app.route('/api/health')
def health_check():
    """Проверка состояния API"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    # Заполняем базу данных начальными данными
    with app.app_context():
        from seed_data import init_data
        init_data()
    
    print("Python Course API запущен!")
    print("Доступен по адресу: http://localhost:5000")
    print("Frontend должен быть запущен на: http://localhost:3000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
