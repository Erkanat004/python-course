from flask import Blueprint, request, jsonify, session
from models import db, User
from datetime import datetime

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    """Регистрация нового пользователя"""
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({
                'success': False,
                'error': 'Все поля обязательны для заполнения'
            }), 400
        
        # Проверяем, существует ли пользователь с таким username или email
        existing_user = User.query.filter(
            (User.username == data['username']) | (User.email == data['email'])
        ).first()
        
        if existing_user:
            return jsonify({
                'success': False,
                'error': 'Пользователь с таким именем или email уже существует'
            }), 400
        
        # Создаем нового пользователя
        user = User(
            username=data['username'],
            email=data['email'],
            is_admin=data.get('is_admin', False)
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Создаем сессию
        session['user_id'] = user.id
        session['username'] = user.username
        session['is_admin'] = user.is_admin
        
        return jsonify({
            'success': True,
            'data': user.to_dict(),
            'message': 'Пользователь успешно зарегистрирован'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/login', methods=['POST'])
def login():
    """Вход пользователя"""
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({
                'success': False,
                'error': 'Имя пользователя и пароль обязательны'
            }), 400
        
        # Ищем пользователя по username
        user = User.query.filter_by(username=data['username']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({
                'success': False,
                'error': 'Неверное имя пользователя или пароль'
            }), 401
        
        # Создаем сессию
        session['user_id'] = user.id
        session['username'] = user.username
        session['is_admin'] = user.is_admin
        
        return jsonify({
            'success': True,
            'data': user.to_dict(),
            'message': 'Успешный вход в систему'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/logout', methods=['POST'])
def logout():
    """Выход пользователя"""
    try:
        session.clear()
        return jsonify({
            'success': True,
            'message': 'Успешный выход из системы'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/me', methods=['GET'])
def get_current_user():
    """Получить информацию о текущем пользователе"""
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'Пользователь не авторизован'
            }), 401
        
        user = User.query.get(user_id)
        if not user:
            session.clear()
            return jsonify({
                'success': False,
                'error': 'Пользователь не найден'
            }), 401
        
        return jsonify({
            'success': True,
            'data': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def require_auth(f):
    """Декоратор для проверки авторизации"""
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({
                'success': False,
                'error': 'Требуется авторизация 1'
            }), 401
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

def require_admin(f):
    """Декоратор для проверки прав администратора"""
    def decorated_function(*args, **kwargs):
        
        if not session.get('is_admin'):
            return jsonify({
                'success': False,
                'error': 'Требуются права администратора'
            }), 403
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

