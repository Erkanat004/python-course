from flask import Blueprint, jsonify, request
from models import db, Test, Question
from datetime import datetime

bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@bp.route('/questions/<int:test_id>', methods=['POST'])
def add_question_to_test(test_id):
    """Добавить вопрос к существующему тесту"""
    try:
        test = Test.query.get_or_404(test_id)
        data = request.get_json()
        
        if not data or not data.get('question_text') or not data.get('correct_answer'):
            return jsonify({
                'success': False,
                'error': 'Текст вопроса и правильный ответ обязательны'
            }), 400
        
        question = Question(
            test_id=test_id,
            question_text=data['question_text'],
            option_a=data.get('option_a', ''),
            option_b=data.get('option_b', ''),
            option_c=data.get('option_c', ''),
            option_d=data.get('option_d', ''),
            correct_answer=data['correct_answer'],
            explanation=data.get('explanation', ''),
            order=data.get('order', 0)
        )
        
        db.session.add(question)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': question.to_dict(),
            'message': 'Вопрос успешно добавлен'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/questions/<int:question_id>', methods=['PUT'])
def update_question(question_id):
    """Обновить вопрос"""
    try:
        question = Question.query.get_or_404(question_id)
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'Данные для обновления не предоставлены'
            }), 400
        
        # Обновляем поля
        if 'question_text' in data:
            question.question_text = data['question_text']
        if 'option_a' in data:
            question.option_a = data['option_a']
        if 'option_b' in data:
            question.option_b = data['option_b']
        if 'option_c' in data:
            question.option_c = data['option_c']
        if 'option_d' in data:
            question.option_d = data['option_d']
        if 'correct_answer' in data:
            question.correct_answer = data['correct_answer']
        if 'explanation' in data:
            question.explanation = data['explanation']
        if 'order' in data:
            question.order = data['order']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': question.to_dict(),
            'message': 'Вопрос успешно обновлен'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/questions/<int:question_id>', methods=['DELETE'])
def delete_question(question_id):
    """Удалить вопрос"""
    try:
        question = Question.query.get_or_404(question_id)
        
        db.session.delete(question)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Вопрос успешно удален'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/stats', methods=['GET'])
def get_stats():
    """Получить статистику по курсу"""
    try:
        from models import Lecture, Test, TestResult
        
        # Подсчитываем статистику
        total_lectures = Lecture.query.count()
        total_tests = Test.query.count()
        total_questions = Question.query.count()
        total_results = TestResult.query.count()
        
        # Статистика по тестам
        test_stats = []
        tests = Test.query.all()
        for test in tests:
            test_results = TestResult.query.filter_by(test_id=test.id).all()
            avg_score = 0
            if test_results:
                avg_score = sum(result.percentage for result in test_results) / len(test_results)
            
            test_stats.append({
                'test_id': test.id,
                'test_title': test.title,
                'attempts': len(test_results),
                'average_score': round(avg_score, 2),
                'passing_rate': round(len([r for r in test_results if r.percentage >= test.passing_score]) / len(test_results) * 100, 2) if test_results else 0
            })
        
        return jsonify({
            'success': True,
            'data': {
                'total_lectures': total_lectures,
                'total_tests': total_tests,
                'total_questions': total_questions,
                'total_results': total_results,
                'test_statistics': test_stats
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
