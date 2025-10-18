from flask import Blueprint, jsonify, request
from models import db, Test, Question, TestResult
from datetime import datetime
import json

bp = Blueprint('tests', __name__, url_prefix='/api/tests')

@bp.route('/', methods=['GET'])
def get_tests():
    """Получить список всех тестов"""
    try:
        tests = Test.query.filter_by(is_active=True).all()
        return jsonify({
            'success': True,
            'data': [test.to_dict() for test in tests]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/<int:test_id>', methods=['GET'])
def get_test(test_id):
    """Получить конкретный тест по ID"""
    try:
        test = Test.query.get_or_404(test_id)
        test_data = test.to_dict()
        
        # Добавляем вопросы к тесту
        questions = Question.query.filter_by(test_id=test_id).order_by(Question.order.asc()).all()
        test_data['questions'] = [question.to_dict() for question in questions]
        
        return jsonify({
            'success': True,
            'data': test_data
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/<int:test_id>/submit', methods=['POST'])
def submit_test(test_id):
    """Отправить ответы на тест"""
    try:
        test = Test.query.get_or_404(test_id)
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'Данные ответов не предоставлены'
            }), 400
        
        student_name = data.get('student_name', 'Анонимный студент')
        answers = data.get('answers', {})
        time_taken = data.get('time_taken', 0)
        
        # Получаем все вопросы теста
        questions = Question.query.filter_by(test_id=test_id).all()
        
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
            question_id = str(question.id)
            user_answer = answers.get(question_id)
            is_correct = user_answer == question.correct_answer
            
            if is_correct:
                correct_answers += 1
            
            detailed_results.append({
                'question_id': question.id,
                'question_text': question.question_text,
                'user_answer': user_answer,
                'correct_answer': question.correct_answer,
                'is_correct': is_correct,
                'explanation': question.explanation
            })
        
        # Вычисляем процент
        percentage = (correct_answers / total_questions) * 100
        
        # Сохраняем результат в базу данных
        test_result = TestResult(
            test_id=test_id,
            student_name=student_name,
            score=correct_answers,
            total_questions=total_questions,
            percentage=percentage,
            time_taken=time_taken,
            answers=json.dumps(answers)
        )
        
        db.session.add(test_result)
        db.session.commit()
        
        # Определяем статус прохождения
        passed = percentage >= test.passing_score
        
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
                'passing_score': test.passing_score,
                'detailed_results': detailed_results,
                'completed_at': test_result.completed_at.isoformat()
            },
            'message': f'Тест {"пройден" if passed else "не пройден"}! Результат: {round(percentage, 2)}%'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/<int:test_id>/results', methods=['GET'])
def get_test_results(test_id):
    """Получить результаты теста"""
    try:
        test = Test.query.get_or_404(test_id)
        results = TestResult.query.filter_by(test_id=test_id).order_by(TestResult.completed_at.desc()).all()
        
        return jsonify({
            'success': True,
            'data': {
                'test': test.to_dict(),
                'results': [result.to_dict() for result in results]
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/', methods=['POST'])
def create_test():
    """Создать новый тест"""
    try:
        data = request.get_json()
        
        if not data or not data.get('title'):
            return jsonify({
                'success': False,
                'error': 'Название теста обязательно'
            }), 400
        
        test = Test(
            title=data['title'],
            description=data.get('description', ''),
            time_limit=data.get('time_limit', 30),
            passing_score=data.get('passing_score', 70)
        )
        
        db.session.add(test)
        db.session.flush()  # Получаем ID теста
        
        # Добавляем вопросы, если они есть
        questions_data = data.get('questions', [])
        for question_data in questions_data:
            question = Question(
                test_id=test.id,
                question_text=question_data['question_text'],
                option_a=question_data.get('option_a', ''),
                option_b=question_data.get('option_b', ''),
                option_c=question_data.get('option_c', ''),
                option_d=question_data.get('option_d', ''),
                correct_answer=question_data['correct_answer'],
                explanation=question_data.get('explanation', ''),
                order=question_data.get('order', 0)
            )
            db.session.add(question)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': test.to_dict(),
            'message': 'Тест успешно создан'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
