from flask import Blueprint, jsonify, request
from models import db, Lecture
from datetime import datetime

bp = Blueprint('lectures', __name__, url_prefix='/api/lectures')

@bp.route('/', methods=['GET'])
def get_lectures():
    """Получить список всех лекций"""
    try:
        lectures = Lecture.query.order_by(Lecture.order.asc()).all()
        return jsonify({
            'success': True,
            'data': [lecture.to_dict() for lecture in lectures]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/<int:lecture_id>', methods=['GET'])
def get_lecture(lecture_id):
    """Получить конкретную лекцию по ID"""
    try:
        lecture = Lecture.query.get_or_404(lecture_id)
        return jsonify({
            'success': True,
            'data': lecture.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/', methods=['POST'])
def create_lecture():
    """Создать новую лекцию"""
    try:
        data = request.get_json()
        
        if not data or not data.get('title') or not data.get('content'):
            return jsonify({
                'success': False,
                'error': 'Название и содержание лекции обязательны'
            }), 400
        
        lecture = Lecture(
            title=data['title'],
            description=data.get('description', ''),
            content=data['content'],
            order=data.get('order', 0)
        )
        
        db.session.add(lecture)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': lecture.to_dict(),
            'message': 'Лекция успешно создана'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/<int:lecture_id>', methods=['PUT'])
def update_lecture(lecture_id):
    """Обновить лекцию"""
    try:
        lecture = Lecture.query.get_or_404(lecture_id)
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'Данные для обновления не предоставлены'
            }), 400
        
        # Обновляем поля
        if 'title' in data:
            lecture.title = data['title']
        if 'description' in data:
            lecture.description = data['description']
        if 'content' in data:
            lecture.content = data['content']
        if 'order' in data:
            lecture.order = data['order']
        
        lecture.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': lecture.to_dict(),
            'message': 'Лекция успешно обновлена'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/<int:lecture_id>', methods=['DELETE'])
def delete_lecture(lecture_id):
    """Удалить лекцию"""
    try:
        lecture = Lecture.query.get_or_404(lecture_id)
        
        db.session.delete(lecture)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Лекция успешно удалена'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
