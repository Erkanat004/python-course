#!/usr/bin/env python3
"""
Простое Flask приложение для Python Course без SQLAlchemy
Использует sqlite3 напрямую для совместимости с Python 3.13
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import json
from datetime import datetime
from contextlib import contextmanager

app = Flask(__name__)
app.config['SECRET_KEY'] = 'python-course-secret-key'

# Настройка CORS для работы с React frontend
CORS(app, origins=['http://localhost:3000'])

# Путь к базе данных
DATABASE = 'python_course.db'

@contextmanager
def get_db_connection():
    """Контекстный менеджер для работы с базой данных"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Для получения результатов как словарей
    try:
        yield conn
    finally:
        conn.close()

def init_database():
    """Инициализация базы данных"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Создание таблицы лекций
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS lectures (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                content TEXT NOT NULL,
                order_num INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Создание таблицы тестов
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                time_limit INTEGER DEFAULT 30,
                passing_score INTEGER DEFAULT 70,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Создание таблицы вопросов
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                test_id INTEGER NOT NULL,
                question_text TEXT NOT NULL,
                option_a TEXT,
                option_b TEXT,
                option_c TEXT,
                option_d TEXT,
                correct_answer TEXT NOT NULL,
                explanation TEXT,
                order_num INTEGER DEFAULT 0,
                FOREIGN KEY (test_id) REFERENCES tests (id)
            )
        ''')
        
        # Создание таблицы результатов тестов
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS test_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                test_id INTEGER NOT NULL,
                student_name TEXT NOT NULL,
                score INTEGER NOT NULL,
                total_questions INTEGER NOT NULL,
                percentage REAL NOT NULL,
                time_taken INTEGER,
                answers TEXT,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (test_id) REFERENCES tests (id)
            )
        ''')
        
        conn.commit()

def seed_data():
    """Заполнение базы данных начальными данными"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Проверяем, есть ли уже данные
        cursor.execute('SELECT COUNT(*) FROM lectures')
        if cursor.fetchone()[0] > 0:
            print("Данные уже существуют в базе")
            return
        
        print("Заполняем базу данных начальными данными...")
        
        # Добавляем лекции
        lectures_data = [
            (
                'Введение в Python',
                'Основы языка программирования Python',
                '''# Введение в Python

Python — это высокоуровневый язык программирования общего назначения, который был создан Гвидо ван Россумом в 1991 году.

## Основные особенности Python:

- **Простота**: Синтаксис Python очень читаемый и понятный
- **Кроссплатформенность**: Работает на Windows, macOS, Linux
- **Большая библиотека**: Богатая стандартная библиотека
- **Интерпретируемость**: Код выполняется построчно

## Первая программа

```python
print("Привет, мир!")
```

## Переменные в Python

```python
# Числа
age = 25
height = 175.5

# Строки
name = "Иван"
message = 'Привет, Python!'

# Списки
fruits = ['яблоко', 'банан', 'апельсин']
```

## Условия

```python
if age >= 18:
    print("Совершеннолетний")
else:
    print("Несовершеннолетний")
```

## Циклы

```python
# Цикл for
for fruit in fruits:
    print(fruit)

# Цикл while
count = 0
while count < 5:
    print(count)
    count += 1
```''',
                1
            ),
            (
                'Типы данных в Python',
                'Изучаем основные типы данных',
                '''# Типы данных в Python

Python поддерживает множество встроенных типов данных.

## Числовые типы

### Целые числа (int)
```python
x = 42
y = -10
print(type(x))  # <class 'int'>
```

### Числа с плавающей точкой (float)
```python
pi = 3.14159
temperature = -5.5
print(type(pi))  # <class 'float'>
```

## Строки (str)

```python
name = "Python"
greeting = 'Привет!'
multiline = """
Это многострочная
строка
"""
```

### Операции со строками
```python
first_name = "Иван"
last_name = "Петров"
full_name = first_name + " " + last_name
print(full_name)  # Иван Петров

# Форматирование строк
age = 25
print(f"Меня зовут {full_name}, мне {age} лет")
```

## Списки (list)

```python
numbers = [1, 2, 3, 4, 5]
fruits = ['яблоко', 'банан', 'апельсин']
mixed = [1, 'hello', 3.14, True]
```

### Операции со списками
```python
# Добавление элементов
fruits.append('груша')
fruits.insert(0, 'виноград')

# Удаление элементов
fruits.remove('банан')
del fruits[0]

# Срезы
print(fruits[1:3])  # ['яблоко', 'апельсин']
```

## Словари (dict)

```python
person = {
    'name': 'Иван',
    'age': 25,
    'city': 'Москва'
}

# Доступ к значениям
print(person['name'])  # Иван
print(person.get('age', 0))  # 25

# Добавление и изменение
person['email'] = 'ivan@example.com'
person['age'] = 26
```

## Кортежи (tuple)

```python
coordinates = (10, 20)
colors = ('красный', 'зеленый', 'синий')

# Кортежи неизменяемы
# coordinates[0] = 15  # Ошибка!
```

## Множества (set)

```python
unique_numbers = {1, 2, 3, 4, 5}
fruits_set = {'яблоко', 'банан', 'апельсин'}

# Операции с множествами
set1 = {1, 2, 3}
set2 = {3, 4, 5}
print(set1.union(set2))  # {1, 2, 3, 4, 5}
print(set1.intersection(set2))  # {3}
```

## Булевы значения (bool)

```python
is_student = True
is_working = False

# Логические операции
print(is_student and is_working)  # False
print(is_student or is_working)   # True
print(not is_student)             # False
```''',
                2
            ),
            (
                'Функции в Python',
                'Создание и использование функций',
                '''# Функции в Python

Функции — это блоки кода, которые можно переиспользовать.

## Простые функции

```python
def greet():
    print("Привет!")

greet()  # Вызов функции
```

## Функции с параметрами

```python
def greet_person(name):
    print(f"Привет, {name}!")

greet_person("Анна")  # Привет, Анна!
```

## Функции с возвращаемым значением

```python
def add(a, b):
    return a + b

result = add(5, 3)
print(result)  # 8
```

## Функции с параметрами по умолчанию

```python
def greet_with_default(name="Гость"):
    print(f"Привет, {name}!")

greet_with_default()  # Привет, Гость!
greet_with_default("Петр")  # Привет, Петр!
```

## Функции с произвольным количеством аргументов

```python
def sum_all(*numbers):
    total = 0
    for num in numbers:
        total += num
    return total

print(sum_all(1, 2, 3, 4))  # 10
```

## Функции с именованными аргументами

```python
def create_profile(name, age, city="Не указано"):
    return {
        'name': name,
        'age': age,
        'city': city
    }

profile = create_profile(age=25, name="Мария")
print(profile)
```

## Лямбда-функции

```python
# Обычная функция
def square(x):
    return x ** 2

# Лямбда-функция
square_lambda = lambda x: x ** 2

print(square(5))        # 25
print(square_lambda(5)) # 25

# Использование с map
numbers = [1, 2, 3, 4, 5]
squares = list(map(lambda x: x ** 2, numbers))
print(squares)  # [1, 4, 9, 16, 25]
```

## Область видимости переменных

```python
x = 10  # Глобальная переменная

def my_function():
    y = 20  # Локальная переменная
    global x  # Обращение к глобальной переменной
    x = 30
    print(f"x = {x}, y = {y}")

my_function()
print(f"x = {x}")  # x = 30
```

## Рекурсивные функции

```python
def factorial(n):
    if n <= 1:
        return 1
    else:
        return n * factorial(n - 1)

print(factorial(5))  # 120
```

## Документация функций

```python
def calculate_area(length, width):
    """
    Вычисляет площадь прямоугольника.
    
    Args:
        length (float): Длина прямоугольника
        width (float): Ширина прямоугольника
    
    Returns:
        float: Площадь прямоугольника
    """
    return length * width

# Доступ к документации
print(calculate_area.__doc__)
```''',
                3
            )
        ]
        
        cursor.executemany(
            'INSERT INTO lectures (title, description, content, order_num) VALUES (?, ?, ?, ?)',
            lectures_data
        )
        
        # Добавляем тесты
        cursor.execute(
            'INSERT INTO tests (title, description, time_limit, passing_score) VALUES (?, ?, ?, ?)',
            ('Основы Python', 'Тест по основам языка Python', 15, 70)
        )
        test1_id = cursor.lastrowid
        
        cursor.execute(
            'INSERT INTO tests (title, description, time_limit, passing_score) VALUES (?, ?, ?, ?)',
            ('Типы данных и функции', 'Тест по типам данных и функциям в Python', 20, 80)
        )
        test2_id = cursor.lastrowid
        
        # Добавляем вопросы для первого теста
        questions_data = [
            (test1_id, 'Что выведет следующий код?\nprint("Hello" + "World")', 'HelloWorld', 'Hello World', 'Ошибка', 'Hello\nWorld', 'A', 'Оператор + объединяет строки без пробела между ними.', 1),
            (test1_id, 'Какой тип данных у переменной x = 3.14?', 'int', 'float', 'str', 'bool', 'B', '3.14 - это число с плавающей точкой, поэтому тип данных float.', 2),
            (test1_id, 'Что выведет код?\nfor i in range(3):\n    print(i)', '1 2 3', '0 1 2', '0 1 2 3', '1 2', 'B', 'range(3) генерирует числа от 0 до 2 включительно.', 3),
            (test1_id, 'Как создать список в Python?', 'list = []', 'list = {}', 'list = ()', 'Все варианты верны', 'A', 'Квадратные скобки [] используются для создания списков.', 4),
            (test1_id, 'Что такое PEP в Python?', 'Python Enhancement Proposal', 'Python Easy Programming', 'Python Error Prevention', 'Python Extension Protocol', 'A', 'PEP (Python Enhancement Proposal) - это документы, описывающие предложения по улучшению Python.', 5)
        ]
        
        cursor.executemany(
            'INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, order_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            questions_data
        )
        
        # Добавляем вопросы для второго теста
        questions_data_2 = [
            (test2_id, 'Что выведет код?\ndef func(x=5):\n    return x * 2\nprint(func())', 'Ошибка', '5', '10', 'x * 2', 'C', 'Функция использует значение по умолчанию x=5, возвращает 5*2=10.', 1),
            (test2_id, 'Какой результат операции 7 // 2 в Python?', '3.5', '3', '4', 'Ошибка', 'B', 'Оператор // выполняет целочисленное деление, результат 7//2 = 3.', 2),
            (test2_id, 'Что такое immutable объект?', 'Объект, который нельзя изменить', 'Объект, который можно изменить', 'Объект без методов', 'Объект только для чтения', 'A', 'Immutable объекты нельзя изменить после создания (например, строки, кортежи).', 3)
        ]
        
        cursor.executemany(
            'INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, order_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            questions_data_2
        )
        
        conn.commit()
        
        print("База данных успешно заполнена!")
        print(f"Добавлено лекций: {len(lectures_data)}")
        print("Добавлено тестов: 2")
        print(f"Добавлено вопросов: {len(questions_data) + len(questions_data_2)}")

# API Routes

@app.route('/')
def index():
    """Главная страница API"""
    return jsonify({
        'message': 'Python Course API',
        'version': '1.0',
        'endpoints': {
            'lectures': '/api/lectures',
            'tests': '/api/tests'
        }
    })

@app.route('/api/health')
def health_check():
    """Проверка состояния API"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

# Lectures API

@app.route('/api/lectures/', methods=['GET'])
def get_lectures():
    """Получить список всех лекций"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM lectures ORDER BY order_num ASC')
            lectures = [dict(row) for row in cursor.fetchall()]
            
            # Конвертируем datetime объекты в строки
            for lecture in lectures:
                if lecture['created_at']:
                    lecture['created_at'] = lecture['created_at']
                if lecture['updated_at']:
                    lecture['updated_at'] = lecture['updated_at']
            
            return jsonify({
                'success': True,
                'data': lectures
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/lectures/<int:lecture_id>', methods=['GET'])
def get_lecture(lecture_id):
    """Получить конкретную лекцию по ID"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM lectures WHERE id = ?', (lecture_id,))
            lecture = cursor.fetchone()
            
            if not lecture:
                return jsonify({
                    'success': False,
                    'error': 'Лекция не найдена'
                }), 404
            
            lecture_dict = dict(lecture)
            if lecture_dict['created_at']:
                lecture_dict['created_at'] = lecture_dict['created_at']
            if lecture_dict['updated_at']:
                lecture_dict['updated_at'] = lecture_dict['updated_at']
            
            return jsonify({
                'success': True,
                'data': lecture_dict
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Tests API

@app.route('/api/tests/', methods=['GET'])
def get_tests():
    """Получить список всех тестов"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM tests WHERE is_active = 1 ORDER BY id ASC')
            tests = [dict(row) for row in cursor.fetchall()]
            
            # Добавляем количество вопросов для каждого теста
            for test in tests:
                cursor.execute('SELECT COUNT(*) FROM questions WHERE test_id = ?', (test['id'],))
                test['questions_count'] = cursor.fetchone()[0]
            
            return jsonify({
                'success': True,
                'data': tests
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/tests/<int:test_id>', methods=['GET'])
def get_test(test_id):
    """Получить конкретный тест по ID"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM tests WHERE id = ?', (test_id,))
            test = cursor.fetchone()
            
            if not test:
                return jsonify({
                    'success': False,
                    'error': 'Тест не найден'
                }), 404
            
            test_dict = dict(test)
            
            # Получаем вопросы теста
            cursor.execute('SELECT * FROM questions WHERE test_id = ? ORDER BY order_num ASC', (test_id,))
            questions = [dict(row) for row in cursor.fetchall()]
            test_dict['questions'] = questions
            
            return jsonify({
                'success': True,
                'data': test_dict
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/tests/<int:test_id>/submit', methods=['POST'])
def submit_test(test_id):
    """Отправить ответы на тест"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'Данные ответов не предоставлены'
            }), 400
        
        student_name = data.get('student_name', 'Анонимный студент')
        answers = data.get('answers', {})
        time_taken = data.get('time_taken', 0)
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Получаем тест
            cursor.execute('SELECT * FROM tests WHERE id = ?', (test_id,))
            test = cursor.fetchone()
            
            if not test:
                return jsonify({
                    'success': False,
                    'error': 'Тест не найден'
                }), 404
            
            # Получаем все вопросы теста
            cursor.execute('SELECT * FROM questions WHERE test_id = ? ORDER BY order_num ASC', (test_id,))
            questions = [dict(row) for row in cursor.fetchall()]
            
            if not questions:
                return jsonify({
                    'success': False,
                    'error': 'В тесте нет вопросов'
                }), 400
            
            # Подсчитываем результаты
            correct_answers = 0
            total_questions = len(questions)
            detailed_results = []
            
            for question in questions:
                question_id = str(question['id'])
                user_answer = answers.get(question_id)
                is_correct = user_answer == question['correct_answer']
                
                if is_correct:
                    correct_answers += 1
                
                detailed_results.append({
                    'question_id': question['id'],
                    'question_text': question['question_text'],
                    'user_answer': user_answer,
                    'correct_answer': question['correct_answer'],
                    'is_correct': is_correct,
                    'explanation': question['explanation']
                })
            
            # Вычисляем процент
            percentage = (correct_answers / total_questions) * 100
            
            # Сохраняем результат в базу данных
            cursor.execute(
                'INSERT INTO test_results (test_id, student_name, score, total_questions, percentage, time_taken, answers) VALUES (?, ?, ?, ?, ?, ?, ?)',
                (test_id, student_name, correct_answers, total_questions, percentage, time_taken, json.dumps(answers))
            )
            
            conn.commit()
            
            # Определяем статус прохождения
            passed = percentage >= test['passing_score']
            
            return jsonify({
                'success': True,
                'data': {
                    'test_id': test_id,
                    'student_name': student_name,
                    'score': correct_answers,
                    'total_questions': total_questions,
                    'percentage': round(percentage, 2),
                    'time_taken': time_taken,
                    'passed': passed,
                    'passing_score': test['passing_score'],
                    'detailed_results': detailed_results,
                    'completed_at': datetime.now().isoformat()
                },
                'message': f'Тест {"пройден" if passed else "не пройден"}! Результат: {round(percentage, 2)}%'
            })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # Инициализация базы данных
    init_database()
    
    # Заполнение начальными данными
    seed_data()
    
    print("Python Course API запущен!")
    print("Доступен по адресу: http://localhost:5000")
    print("Frontend должен быть запущен на: http://localhost:3000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
