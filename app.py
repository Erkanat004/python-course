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
    ================================================================
                    Python Course
              Educational Python Programming Site
                                                              
      Lectures on Python                                         
      Interactive Tests                                     
      Knowledge Testing                                         
                                                              
      Backend:  http://localhost:5000                             
      Frontend: http://localhost:3000                             
    ================================================================
    """
    print(banner)

def check_python_version():
    """Проверка версии Python"""
    if sys.version_info < (3, 7):
        print("ERROR: Requires Python 3.7 or higher")
        print(f"   Current version: {sys.version}")
        sys.exit(1)
    print(f"Python version: {sys.version.split()[0]}")

def install_requirements():
    """Установка зависимостей"""
    print("\nInstalling dependencies...")
    
    # Backend requirements
    backend_req = Path("backend/requirements.txt")
    if backend_req.exists():
        try:
            subprocess.run([
                sys.executable, "-m", "pip", "install", "-r", str(backend_req)
            ], check=True, capture_output=True)
            print("Backend dependencies installed")
        except subprocess.CalledProcessError as e:
            print(f"Error installing backend dependencies: {e}")
            return False
    
    # Frontend dependencies
    frontend_dir = Path("frontend")
    if frontend_dir.exists():
        print("Installing frontend dependencies...")
        try:
            subprocess.run(["npm", "install"], cwd=frontend_dir, check=True)
            print("Frontend dependencies installed")
        except (subprocess.CalledProcessError, FileNotFoundError) as e:
            print(f"Error installing frontend dependencies: {e}")
            print("   Make sure Node.js and npm are installed")
            print("   You can skip frontend setup and run it manually later")
            # Не останавливаем выполнение, если npm не найден
    
    return True

def start_backend():
    """Запуск backend сервера"""
    print("\nStarting backend server...")
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("ERROR: Backend folder not found")
        return None
    
    try:
        # Запускаем Flask приложение
        process = subprocess.Popen([
            sys.executable, "app.py"
        ], cwd=backend_dir)
        print("Backend server started on http://localhost:5000")
        return process
    except Exception as e:
        print(f"Error starting backend: {e}")
        return None

def start_frontend():
    """Запуск frontend сервера"""
    print("\nStarting frontend server...")
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("ERROR: Frontend folder not found")
        return None
    
    try:
        # Запускаем React приложение
        process = subprocess.Popen([
            "npm", "start"
        ], cwd=frontend_dir)
        print("Frontend server started on http://localhost:3000")
        return process
    except FileNotFoundError:
        print("ERROR: npm not found. Please install Node.js and npm first.")
        print("   Download from: https://nodejs.org/")
        print("   Then run: cd frontend && npm install && npm start")
        return None
    except Exception as e:
        print(f"Error starting frontend: {e}")
        return None

def wait_for_servers():
    """Ожидание запуска серверов"""
    print("\nWaiting for servers to start...")
    time.sleep(5)
    print("Servers should be ready!")

def cleanup_processes(processes):
    """Очистка процессов при завершении"""
    print("\nShutting down...")
    for process in processes:
        if process and process.poll() is None:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
    print("Processes terminated")

def main():
    """Главная функция"""
    print_banner()
    
    # Проверка версии Python
    check_python_version()
    
    # Установка зависимостей
    if not install_requirements():
        print("ERROR: Failed to install dependencies")
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
            print("ERROR: Failed to start any server")
            sys.exit(1)
        
        # Ожидание запуска
        wait_for_servers()
        
        print("\n" + "="*60)
        print("Python Course is running!")
        print("Lectures: http://localhost:3000/lectures")
        print("Tests: http://localhost:3000/tests")
        print("Home: http://localhost:3000")
        print("="*60)
        print("\nPress Ctrl+C to stop")
        
        # Ожидание завершения
        try:
            while True:
                time.sleep(1)
                # Проверяем, что процессы еще работают
                for process in processes:
                    if process.poll() is not None:
                        print(f"WARNING: Process terminated unexpectedly")
                        raise KeyboardInterrupt
        except KeyboardInterrupt:
            pass
    
    except Exception as e:
        print(f"ERROR: {e}")
    
    finally:
        # Очистка процессов
        cleanup_processes(processes)

if __name__ == "__main__":
    main()
