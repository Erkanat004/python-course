import React, { useState } from 'react';
import { Play, RotateCcw, Copy, Download, Upload } from 'lucide-react';
import './Compiler.css';

const Compiler = () => {
  const [code, setCode] = useState(`# -*- coding: utf-8 -*-
# Добро пожаловать в онлайн-компилятор Python!
# Напишите свой код здесь

print("Привет, мир!")

# Примеры:
# name = input("Введите ваше имя: ")
# print(f"Привет, {name}!")

# for i in range(5):
#     print(f"Число: {i}")

# def factorial(n):
#     if n <= 1:
#         return 1
#     return n * factorial(n - 1)
# 
# print(f"Факториал 5: {factorial(5)}")`);

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');

  const runCode = async () => {
    setIsRunning(true);
    setError('');
    setOutput('');

    try {
      // Отправляем код на наш бэкенд для выполнения
      const response = await fetch('http://python-course-zg1y-dap4i8lay-erkanat004s-projects.vercel.app/api/compiler/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setOutput(result.output || 'Код выполнен успешно');
      } else {
        setError(result.error || 'Ошибка выполнения кода');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером. Попробуйте позже.');
    } finally {
      setIsRunning(false);
    }
  };

  const clearCode = () => {
    setCode('');
    setOutput('');
    setError('');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const examples = [
    {
      name: 'Привет, мир!',
      code: '# -*- coding: utf-8 -*-\nprint("Привет, мир!")\nprint("Добро пожаловать в Python!")'
    },
    {
      name: 'Калькулятор',
      code: `# -*- coding: utf-8 -*-
# Простой калькулятор без input() для демонстрации
def calculator(a, b, operation):
    if operation == '+':
        return a + b
    elif operation == '-':
        return a - b
    elif operation == '*':
        return a * b
    elif operation == '/':
        if b != 0:
            return a / b
        else:
            return "Ошибка: деление на ноль"
    else:
        return "Неверная операция"

# Примеры использования
print("Калькулятор:")
print(f"5 + 3 = {calculator(5, 3, '+')}")
print(f"10 - 4 = {calculator(10, 4, '-')}")
print(f"6 * 7 = {calculator(6, 7, '*')}")
print(f"15 / 3 = {calculator(15, 3, '/')}")
print(f"8 / 0 = {calculator(8, 0, '/')}")`
    },
    {
      name: 'Список и циклы',
      code: `# -*- coding: utf-8 -*-
fruits = ['яблоко', 'банан', 'апельсин', 'виноград']

print("Фрукты в списке:")
for i, fruit in enumerate(fruits, 1):
    print(f"{i}. {fruit}")

print(f"\\nВсего фруктов: {len(fruits)}")`
    },
    {
      name: 'Функции',
      code: `# -*- coding: utf-8 -*-
def greet(name, age):
    return f"Привет, {name}! Тебе {age} лет."

def calculate_area(length, width):
    return length * width

# Использование функций
print(greet("Анна", 25))
print(f"Площадь прямоугольника: {calculate_area(5, 3)}")`
    },
    {
      name: 'Интерактивный калькулятор',
      code: `# -*- coding: utf-8 -*-
# Этот пример показывает, как работает input()
# В онлайн-компиляторе input() будет ждать ввода и может вызвать таймаут

print("Интерактивный калькулятор:")
print("Введите числа и операцию:")

# Пример с input() - может вызвать таймаут в онлайн-компиляторе
try:
    a = float(input("Первое число: "))
    b = float(input("Второе число: "))
    operation = input("Операция (+, -, *, /): ")
    
    if operation == '+':
        result = a + b
    elif operation == '-':
        result = a - b
    elif operation == '*':
        result = a * b
    elif operation == '/':
        result = a / b
    else:
        result = "Неверная операция"
    
    print(f"Результат: {result}")
except:
    print("Ошибка: input() не работает в онлайн-компиляторе")
    print("Используйте пример 'Калькулятор' для демонстрации функций")`
    }
  ];

  const tasks = [
    {
      title: 'Найди ошибку в коде',
      difficulty: 'Легко',
      description: 'В этом коде есть синтаксическая ошибка. Найдите и исправьте её.',
      problem: `# -*- coding: utf-8 -*-
# Найдите ошибку в этом коде
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)

numbers = [10, 20, 30, 40]
average = calculate_average(numbers)
print(f"Среднее значение: {average}")`,
      solution: `# -*- coding: utf-8 -*-
# Исправленный код - добавлена проверка на пустой список
def calculate_average(numbers):
    if len(numbers) == 0:
        return 0  # или можно выбросить исключение
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)

numbers = [10, 20, 30, 40]
average = calculate_average(numbers)
print(f"Среднее значение: {average}")`
    },
    {
      title: 'Напиши функцию факториала',
      difficulty: 'Средне',
      description: 'Напишите функцию для вычисления факториала числа.',
      problem: `# -*- coding: utf-8 -*-
# Напишите функцию factorial(n), которая возвращает факториал числа n
# Факториал n! = n * (n-1) * (n-2) * ... * 1
# Например: 5! = 5 * 4 * 3 * 2 * 1 = 120
# Особые случаи: 0! = 1, 1! = 1

def factorial(n):
    # Ваш код здесь
    pass

# Тестирование
print(f"5! = {factorial(5)}")
print(f"3! = {factorial(3)}")
print(f"0! = {factorial(0)}")
print(f"1! = {factorial(1)}")`,
      solution: `# -*- coding: utf-8 -*-
# Решение задачи с факториалом
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Тестирование
print(f"5! = {factorial(5)}")
print(f"3! = {factorial(3)}")
print(f"0! = {factorial(0)}")`
    },
    {
      title: 'Создай калькулятор',
      difficulty: 'Средне',
      description: 'Создайте простой калькулятор с функциями сложения, вычитания, умножения и деления.',
      problem: `# -*- coding: utf-8 -*-
# Создайте калькулятор с функциями:
# - add(a, b) - сложение
# - subtract(a, b) - вычитание  
# - multiply(a, b) - умножение
# - divide(a, b) - деление (обработайте деление на ноль)

def add(a, b):
    # Ваш код здесь
    pass

def subtract(a, b):
    # Ваш код здесь
    pass

def multiply(a, b):
    # Ваш код здесь
    pass

def divide(a, b):
    # Ваш код здесь
    pass

# Тестирование
print(f"10 + 5 = {add(10, 5)}")
print(f"10 - 5 = {subtract(10, 5)}")
print(f"10 * 5 = {multiply(10, 5)}")
print(f"10 / 5 = {divide(10, 5)}")
print(f"10 / 0 = {divide(10, 0)}")`,
      solution: `# -*- coding: utf-8 -*-
# Решение задачи с калькулятором
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "Ошибка: деление на ноль"
    return a / b

# Тестирование
print(f"10 + 5 = {add(10, 5)}")
print(f"10 - 5 = {subtract(10, 5)}")
print(f"10 * 5 = {multiply(10, 5)}")
print(f"10 / 5 = {divide(10, 5)}")
print(f"10 / 0 = {divide(10, 0)}")`
    },
    {
      title: 'Найди максимальное число',
      difficulty: 'Легко',
      description: 'Напишите функцию для поиска максимального числа в списке.',
      problem: `# -*- coding: utf-8 -*-
# Напишите функцию find_max(numbers), которая возвращает максимальное число из списка
# Не используйте встроенную функцию max()

def find_max(numbers):
    # Ваш код здесь
    pass

# Тестирование
numbers1 = [1, 5, 3, 9, 2]
numbers2 = [-1, -5, -3, -9, -2]
numbers3 = [42]

print(f"Максимум в {numbers1}: {find_max(numbers1)}")
print(f"Максимум в {numbers2}: {find_max(numbers2)}")
print(f"Максимум в {numbers3}: {find_max(numbers3)}")`,
      solution: `# -*- coding: utf-8 -*-
# Решение задачи поиска максимума
def find_max(numbers):
    if not numbers:
        return None
    
    max_num = numbers[0]
    for num in numbers:
        if num > max_num:
            max_num = num
    return max_num

# Тестирование
numbers1 = [1, 5, 3, 9, 2]
numbers2 = [-1, -5, -3, -9, -2]
numbers3 = [42]

print(f"Максимум в {numbers1}: {find_max(numbers1)}")
print(f"Максимум в {numbers2}: {find_max(numbers2)}")
print(f"Максимум в {numbers3}: {find_max(numbers3)}")`
    },
    {
      title: 'Проверь палиндром',
      difficulty: 'Средне',
      description: 'Напишите функцию для проверки, является ли строка палиндромом.',
      problem: `# -*- coding: utf-8 -*-
# Напишите функцию is_palindrome(text), которая проверяет, является ли строка палиндромом
# Палиндром - это строка, которая читается одинаково слева направо и справа налево
# Игнорируйте регистр и пробелы

def is_palindrome(text):
    # Ваш код здесь
    pass

# Тестирование
test_words = ["А роза упала на лапу Азора", "racecar", "hello", "level", "Python"]
for word in test_words:
    result = is_palindrome(word)
    print(f"'{word}' - палиндром: {result}")`,
      solution: `# -*- coding: utf-8 -*-
# Решение задачи с палиндромом
def is_palindrome(text):
    # Убираем пробелы и приводим к нижнему регистру
    cleaned = text.replace(" ", "").lower()
    # Сравниваем строку с её обращением
    return cleaned == cleaned[::-1]

# Тестирование
test_words = ["А роза упала на лапу Азора", "racecar", "hello", "level", "Python"]
for word in test_words:
    result = is_palindrome(word)
    print(f"'{word}' - палиндром: {result}")`
    },
    {
      title: 'Сортировка пузырьком',
      difficulty: 'Сложно',
      description: 'Реализуйте алгоритм сортировки пузырьком.',
      problem: `# -*- coding: utf-8 -*-
# Реализуйте алгоритм сортировки пузырьком
# Функция bubble_sort(numbers) должна отсортировать список по возрастанию

def bubble_sort(numbers):
    # Ваш код здесь
    pass

# Тестирование
numbers = [64, 34, 25, 12, 22, 11, 90]
print(f"Исходный список: {numbers}")
sorted_numbers = bubble_sort(numbers.copy())
print(f"Отсортированный список: {sorted_numbers}")`,
      solution: `# -*- coding: utf-8 -*-
# Решение задачи с сортировкой пузырьком
def bubble_sort(numbers):
    n = len(numbers)
    for i in range(n):
        for j in range(0, n - i - 1):
            if numbers[j] > numbers[j + 1]:
                numbers[j], numbers[j + 1] = numbers[j + 1], numbers[j]
    return numbers

# Тестирование
numbers = [64, 34, 25, 12, 22, 11, 90]
print(f"Исходный список: {numbers}")
sorted_numbers = bubble_sort(numbers.copy())
print(f"Отсортированный список: {sorted_numbers}")`
    },
    {
      title: 'Исправь ошибку с переменными',
      difficulty: 'Легко',
      description: 'В этом коде есть ошибка с переменными. Найдите и исправьте её.',
      problem: `# -*- coding: utf-8 -*-
# Найдите ошибку в этом коде (проблема с отступами)
def print_numbers():
    numbers = [1, 2, 3, 4, 5]
    for num in numbers:
    print(f"Число: {num}")  # Ошибка в отступе!

print_numbers()`,
      solution: `# -*- coding: utf-8 -*-
# Исправленный код - правильные отступы
def print_numbers():
    numbers = [1, 2, 3, 4, 5]
    for num in numbers:
        print(f"Число: {num}")  # Правильный отступ

print_numbers()`
    }
  ];

  const loadExample = (exampleCode) => {
    setCode(exampleCode);
    setOutput('');
    setError('');
  };

  const loadTask = (task) => {
    setCode(task.problem);
    setOutput('');
    setError('');
  };

  const showSolution = (task) => {
    setCode(task.solution);
    setOutput('');
    setError('');
  };

  return (
    <div className="compiler-container">
      <div className="compiler-header">
        <h1>🐍 Онлайн-компилятор Python</h1>
        <p>Напишите и запустите код Python прямо в браузере</p>
      </div>

      <div className="compiler-main">
        {/* Левая панель - код */}
        <div className="code-panel">
          <div className="panel-header">
            <h3>Код Python</h3>
            <div className="panel-actions">
              <button 
                onClick={runCode} 
                disabled={isRunning}
                className="btn btn-primary"
              >
                <Play size={16} />
                {isRunning ? 'Выполняется...' : 'Запустить'}
              </button>
              <button onClick={clearCode} className="btn btn-secondary">
                <RotateCcw size={16} />
                Очистить
              </button>
              <button onClick={copyCode} className="btn btn-secondary">
                <Copy size={16} />
                Копировать
              </button>
              <button onClick={downloadCode} className="btn btn-secondary">
                <Download size={16} />
                Скачать
              </button>
              <label className="btn btn-secondary upload-btn">
                <Upload size={16} />
                Загрузить
                <input
                  type="file"
                  accept=".py,.txt"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="code-editor"
            placeholder="Введите ваш Python код здесь..."
            spellCheck={false}
          />
        </div>

        {/* Правая панель - результат */}
        <div className="output-panel">
          <div className="panel-header">
            <h3>Результат выполнения</h3>
            <div className="panel-actions">
              <button onClick={copyOutput} className="btn btn-secondary">
                <Copy size={16} />
                Копировать
              </button>
            </div>
          </div>
          <div className="output-container">
            {isRunning && (
              <div className="loading">
                <div className="spinner"></div>
                <span>Выполняется код...</span>
              </div>
            )}
            {error && (
              <div className="error-output">
                <pre>{error}</pre>
              </div>
            )}
            {output && !isRunning && (
              <div className="success-output">
                <pre>{output}</pre>
              </div>
            )}
            {!output && !error && !isRunning && (
              <div className="empty-output">
                <p>Результат выполнения кода появится здесь</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Примеры кода */}
      <div className="examples-section">
        <h3>Примеры кода</h3>
        <div className="examples-grid">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => loadExample(example.code)}
              className="example-card"
            >
              <h4>{example.name}</h4>
              <p>Нажмите, чтобы загрузить пример</p>
            </button>
          ))}
        </div>
      </div>

      {/* Задачи для решения */}
      <div className="tasks-section">
        <h3>🎯 Задачи для решения</h3>
        <p>Попробуйте решить эти задачи самостоятельно!</p>
        <div className="tasks-grid">
          {tasks.map((task, index) => (
            <div key={index} className="task-card">
              <div className="task-header">
                <h4>{task.title}</h4>
                <span className="task-difficulty">{task.difficulty}</span>
              </div>
              <div className="task-description">
                <p>{task.description}</p>
              </div>
              <div className="task-actions">
                <button
                  onClick={() => loadTask(task)}
                  className="btn btn-primary"
                >
                  Начать решение
                </button>
                <button
                  onClick={() => showSolution(task)}
                  className="btn btn-secondary"
                >
                  Показать решение
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Информация о компиляторе */}
      <div className="compiler-info">
        <div className="info-card">
          <h4>📝 Возможности</h4>
          <ul>
            <li>Выполнение Python 3 кода</li>
            <li>Поддержка всех стандартных библиотек</li>
            <li>Ввод данных через input()</li>
            <li>Сохранение и загрузка файлов</li>
            <li>Готовые примеры для изучения</li>
          </ul>
        </div>
        <div className="info-card">
          <h4>⚠️ Ограничения</h4>
          <ul>
            <li>Время выполнения: до 10 секунд</li>
            <li>Память: до 256 MB</li>
            <li>Нет доступа к файловой системе</li>
            <li>Нет сетевых запросов</li>
            <li>input() может вызвать таймаут</li>
          </ul>
        </div>
        <div className="info-card">
          <h4>💡 Советы</h4>
          <ul>
            <li>Используйте примеры для быстрого старта</li>
            <li>Проверяйте синтаксис перед запуском</li>
            <li>Сохраняйте важный код локально</li>
            <li>Изучайте ошибки для улучшения кода</li>
            <li>Избегайте input() - используйте переменные</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Compiler;
