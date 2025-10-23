from flask import Blueprint, jsonify, request
from models import db, User
from .auth import require_admin

bp = Blueprint('users', __name__, url_prefix='/api/users')

@bp.route('/', methods=['GET'])
@require_admin
def get_all_users():
    """Получить всех пользователей (только для администраторов)"""
    try:
        users = User.query.all()
        return jsonify({
            'success': True,
            'data': [user.to_dict() for user in users]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/<int:user_id>', methods=['GET'])
@require_admin
def get_user(user_id):
    """Получить информацию о пользователе"""
    try:
        user = User.query.get_or_404(user_id)
        return jsonify({
            'success': True,
            'data': user.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/<int:user_id>/promote', methods=['POST'])
@require_admin
def promote_user(user_id):
    """Сделать пользователя администратором"""
    try:
        user = User.query.get_or_404(user_id)
        user.is_admin = True
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': user.to_dict(),
            'message': 'Пользователь повышен до администратора'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/<int:user_id>/demote', methods=['POST'])
@require_admin
def demote_user(user_id):
    """Убрать права администратора у пользователя"""
    try:
        user = User.query.get_or_404(user_id)
        user.is_admin = False
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': user.to_dict(),
            'message': 'Права администратора отозваны'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/<int:user_id>/ban', methods=['POST'])
@require_admin
def ban_user(user_id):
    """Заблокировать пользователя"""
    try:
        user = User.query.get_or_404(user_id)
        user.is_banned = True
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': user.to_dict(),
            'message': 'Пользователь заблокирован'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/<int:user_id>/unban', methods=['POST'])
@require_admin
def unban_user(user_id):
    """Разблокировать пользователя"""
    try:
        user = User.query.get_or_404(user_id)
        user.is_banned = False
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': user.to_dict(),
            'message': 'Пользователь разблокирован'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
