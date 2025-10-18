#!/usr/bin/env python3
"""
Главный файл для запуска Python Course Learning Platform
Учебный сайт по Python с лекциями и тестами
"""

import os
import sys
import subprocess
import time
import signal
from pathlib import Path

def print_banner():
    """Печать баннера приложения"""
    banner = """
    ╔══════════════════════════════════════════════════════════════╗
    ║                    🐍 Python Course                         ║
    ║              Учебный сайт по программированию               ║
    ║                                                              ║
    ║  🎯 Лекции по Python                                         ║
    ║  🧩 Интерактивные тесты                                     ║
    ║  📊 Проверка знаний                                         ║
    ║                                                              ║
    ║  Backend:  http://localhost:5000                             ║
    ║  Frontend: http://localhost:3000                             ║
    ╚══════════════════════════════════════════════════════════════╝
    """
    print(banner)

def check_python_version():
    """Проверка версии Python"""
    if sys.version_info < (3, 7):
        print("❌ Ошибка: Требуется Python 3.7 или выше")
        print(f"   Текущая версия: {sys.version}")
        sys.exit(1)
    print(f"✅ Python версия: {sys.version.split()[0]}")

def install_requirements():
    """Установка зависимостей"""
    print("\n📦 Установка зависимостей...")
    
    # Backend requirements
    backend_req = Path("backend/requirements.txt")
    if backend_req.exists():
        try:
            subprocess.run([
                sys.executable, "-m", "pip", "install", "-r", str(backend_req)
            ], check=True, capture_output=True)
            print("✅ Backend зависимости установлены")
        except subprocess.CalledProcessError as e:
            print(f"❌ Ошибка установки backend зависимостей: {e}")
            return False
    
    # Frontend dependencies
    frontend_dir = Path("frontend")
    if frontend_dir.exists():
        print("📦 Установка frontend зависимостей...")
        try:
            subprocess.run(["npm", "install"], cwd=frontend_dir, check=True)
            print("✅ Frontend зависимости установлены")
        except subprocess.CalledProcessError as e:
            print(f"❌ Ошибка установки frontend зависимостей: {e}")
            print("   Убедитесь, что Node.js и npm установлены")
            return False
    
    return True

def start_backend():
    """Запуск backend сервера"""
    print("\n🚀 Запуск backend сервера...")
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Папка backend не найдена")
        return None
    
    try:
        # Запускаем Flask приложение
        process = subprocess.Popen([
            sys.executable, "app.py"
        ], cwd=backend_dir)
        print("✅ Backend сервер запущен на http://localhost:5000")
        return process
    except Exception as e:
        print(f"❌ Ошибка запуска backend: {e}")
        return None

def start_frontend():
    """Запуск frontend сервера"""
    print("\n🎨 Запуск frontend сервера...")
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Папка frontend не найдена")
        return None
    
    try:
        # Запускаем React приложение
        process = subprocess.Popen([
            "npm", "start"
        ], cwd=frontend_dir)
        print("✅ Frontend сервер запущен на http://localhost:3000")
        return process
    except Exception as e:
        print(f"❌ Ошибка запуска frontend: {e}")
        return None

def wait_for_servers():
    """Ожидание запуска серверов"""
    print("\n⏳ Ожидание запуска серверов...")
    time.sleep(5)
    print("🎉 Серверы должны быть готовы!")

def cleanup_processes(processes):
    """Очистка процессов при завершении"""
    print("\n🛑 Завершение работы...")
    for process in processes:
        if process and process.poll() is None:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
    print("✅ Процессы завершены")

def main():
    """Главная функция"""
    print_banner()
    
    # Проверка версии Python
    check_python_version()
    
    # Установка зависимостей
    if not install_requirements():
        print("❌ Не удалось установить зависимости")
        sys.exit(1)
    
    processes = []
    
    try:
        # Запуск backend
        backend_process = start_backend()
        if backend_process:
            processes.append(backend_process)
        
        # Запуск frontend
        frontend_process = start_frontend()
        if frontend_process:
            processes.append(frontend_process)
        
        if not processes:
            print("❌ Не удалось запустить ни один сервер")
            sys.exit(1)
        
        # Ожидание запуска
        wait_for_servers()
        
        print("\n" + "="*60)
        print("🎯 Python Course запущен!")
        print("📚 Лекции: http://localhost:3000/lectures")
        print("🧩 Тесты: http://localhost:3000/tests")
        print("🏠 Главная: http://localhost:3000")
        print("="*60)
        print("\nНажмите Ctrl+C для завершения работы")
        
        # Ожидание завершения
        try:
            while True:
                time.sleep(1)
                # Проверяем, что процессы еще работают
                for process in processes:
                    if process.poll() is not None:
                        print(f"⚠️  Процесс завершился неожиданно")
                        raise KeyboardInterrupt
        except KeyboardInterrupt:
            pass
    
    except Exception as e:
        print(f"❌ Ошибка: {e}")
    
    finally:
        # Очистка процессов
        cleanup_processes(processes)

if __name__ == "__main__":
    main()
