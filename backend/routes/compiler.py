from flask import Blueprint, jsonify, request
import subprocess
import tempfile
import os
import sys
import traceback
from io import StringIO

bp = Blueprint('compiler', __name__, url_prefix='/api/compiler')

@bp.route('/execute', methods=['POST'])
def execute_code():
    """Выполнить Python код"""
    try:
        data = request.get_json()
        
        if not data or not data.get('code'):
            return jsonify({
                'success': False,
                'error': 'Код не предоставлен'
            }), 400
        
        code = data['code']
        
        # Проверяем, есть ли уже объявление кодировки в коде
        if not ('coding:' in code or 'encoding:' in code):
            code = '# -*- coding: utf-8 -*-\n' + code
        
        # Создаем временный файл для кода с указанием кодировки UTF-8
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8') as f:
            f.write(code)
            temp_file = f.name
        
        try:
            # Выполняем код и захватываем вывод
            result = subprocess.run(
                [sys.executable, temp_file],
                capture_output=True,
                text=True,
                timeout=10,  # Ограничение времени выполнения
                cwd=tempfile.gettempdir()
            )
            
            # Удаляем временный файл
            os.unlink(temp_file)
            
            if result.returncode == 0:
                return jsonify({
                    'success': True,
                    'output': result.stdout
                })
            else:
                return jsonify({
                    'success': False,
                    'error': result.stderr or 'Ошибка выполнения кода'
                })
                
        except subprocess.TimeoutExpired:
            # Удаляем временный файл
            os.unlink(temp_file)
            return jsonify({
                'success': False,
                'error': 'Превышено время выполнения (10 секунд)'
            })
            
        except Exception as e:
            # Удаляем временный файл
            if os.path.exists(temp_file):
                os.unlink(temp_file)
            return jsonify({
                'success': False,
                'error': f'Ошибка выполнения: {str(e)}'
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Ошибка сервера: {str(e)}'
        }), 500

@bp.route('/check', methods=['GET'])
def check_compiler():
    """Проверить доступность компилятора"""
    try:
        result = subprocess.run(
            [sys.executable, '--version'],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if result.returncode == 0:
            return jsonify({
                'success': True,
                'version': result.stdout.strip(),
                'message': 'Python компилятор доступен'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Python компилятор недоступен'
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Ошибка проверки компилятора: {str(e)}'
        }), 500
