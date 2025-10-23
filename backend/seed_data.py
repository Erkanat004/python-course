from models import db, Lecture, Test, Question, User
from datetime import datetime

def init_data():
    """Инициализация базы данных начальными данными"""
    
    # Проверяем, есть ли уже данные
    if Lecture.query.first() is not None:
        print("Данные уже существуют в базе")
        return
    
    print("Заполняем базу данных начальными данными...")
    
    # Создаем тестового администратора
    admin_user = User(
        username='admin_E',
        email='admin@example.com',
        is_admin=True
    )
    admin_user.set_password('admin041120')
    db.session.add(admin_user)
    print("Создан тестовый администратор: admin_E / admin041120")
    
    # Создаем лекции
    lectures_data = [
        {
            'title': 'Введение в Python',
            'description': 'Основы языка программирования Python',
            'content': '''
# Введение в Python

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
```
            ''',
            'order': 1
        },
        {
            'title': 'Типы данных в Python',
            'description': 'Изучаем основные типы данных',
            'content': '''
# Типы данных в Python

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

### Комплексные числа (complex)
```python
z = 3 + 4j
print(type(z))  # <class 'complex'>
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
```
            ''',
            'order': 2
        },
        {
            'title': 'Функции в Python',
            'description': 'Создание и использование функций',
            'content': '''
# Функции в Python

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
```
            ''',
            'order': 3
        }
    ]
    
    # Добавляем лекции в базу
    for lecture_data in lectures_data:
        lecture = Lecture(**lecture_data)
        db.session.add(lecture)
    
    # Создаем тесты
    test1 = Test(
        title='Основы Python',
        description='Тест по основам языка Python',
        time_limit=15,
        passing_score=70
    )
    db.session.add(test1)
    db.session.flush()  # Получаем ID теста
    
    # Вопросы для первого теста
    questions_data = [
        {
            'test_id': test1.id,
            'question_text': 'Что выведет следующий код?\nprint("Hello" + "World")',
            'option_a': 'HelloWorld',
            'option_b': 'Hello World',
            'option_c': 'Ошибка',
            'option_d': 'Hello\nWorld',
            'correct_answer': 'A',
            'explanation': 'Оператор + объединяет строки без пробела между ними.',
            'order': 1
        },
        {
            'test_id': test1.id,
            'question_text': 'Какой тип данных у переменной x = 3.14?',
            'option_a': 'int',
            'option_b': 'float',
            'option_c': 'str',
            'option_d': 'bool',
            'correct_answer': 'B',
            'explanation': '3.14 - это число с плавающей точкой, поэтому тип данных float.',
            'order': 2
        },
        {
            'test_id': test1.id,
            'question_text': 'Что выведет код?\nfor i in range(3):\n    print(i)',
            'option_a': '1 2 3',
            'option_b': '0 1 2',
            'option_c': '0 1 2 3',
            'option_d': '1 2',
            'correct_answer': 'B',
            'explanation': 'range(3) генерирует числа от 0 до 2 включительно.',
            'order': 3
        },
        {
            'test_id': test1.id,
            'question_text': 'Как создать список в Python?',
            'option_a': 'list = []',
            'option_b': 'list = {}',
            'option_c': 'list = ()',
            'option_d': 'Все варианты верны',
            'correct_answer': 'A',
            'explanation': 'Квадратные скобки [] используются для создания списков.',
            'order': 4
        },
        {
            'test_id': test1.id,
            'question_text': 'Что такое PEP в Python?',
            'option_a': 'Python Enhancement Proposal',
            'option_b': 'Python Easy Programming',
            'option_c': 'Python Error Prevention',
            'option_d': 'Python Extension Protocol',
            'correct_answer': 'A',
            'explanation': 'PEP (Python Enhancement Proposal) - это документы, описывающие предложения по улучшению Python.',
            'order': 5
        }
    ]
    
    for question_data in questions_data:
        question = Question(**question_data)
        db.session.add(question)
    
    # Второй тест
    test2 = Test(
        title='Типы данных и функции',
        description='Тест по типам данных и функциям в Python',
        time_limit=20,
        passing_score=80
    )
    db.session.add(test2)
    db.session.flush()
    
    questions_data_2 = [
        {
            'test_id': test2.id,
            'question_text': 'Что выведет код?\ndef func(x=5):\n    return x * 2\nprint(func())',
            'option_a': 'Ошибка',
            'option_b': '5',
            'option_c': '10',
            'option_d': 'x * 2',
            'correct_answer': 'C',
            'explanation': 'Функция использует значение по умолчанию x=5, возвращает 5*2=10.',
            'order': 1
        },
        {
            'test_id': test2.id,
            'question_text': 'Какой результат операции 7 // 2 в Python?',
            'option_a': '3.5',
            'option_b': '3',
            'option_c': '4',
            'option_d': 'Ошибка',
            'correct_answer': 'B',
            'explanation': 'Оператор // выполняет целочисленное деление, результат 7//2 = 3.',
            'order': 2
        },
        {
            'test_id': test2.id,
            'question_text': 'Что такое immutable объект?',
            'option_a': 'Объект, который нельзя изменить',
            'option_b': 'Объект, который можно изменить',
            'option_c': 'Объект без методов',
            'option_d': 'Объект только для чтения',
            'correct_answer': 'A',
            'explanation': 'Immutable объекты нельзя изменить после создания (например, строки, кортежи).',
            'order': 3
        }
    ]
    
    for question_data in questions_data_2:
        question = Question(**question_data)
        db.session.add(question)
    
    # Сохраняем все изменения
    db.session.commit()
    
    print("База данных успешно заполнена!")
    print(f"Добавлено лекций: {len(lectures_data)}")
    print(f"Добавлено тестов: 2")
    print(f"Добавлено вопросов: {len(questions_data) + len(questions_data_2)}")
