#!/usr/bin/env python3
"""
Launcher script for Personalized Academic Learning and Visual Programming Assistant.
Initializes the SQLite database with seed records and launches the Flask web application.
"""

import sys
import os

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from app import app
from database import init_db, seed_sample_data

def main():
    print("=" * 70)
    print(" Personalized Academic Learning & Visual Programming Assistance System ")
    print(" Intelligent Student Workload Management & Visual Code Transpiler")
    print("=" * 70)
    
    print("[1/2] Verifying database schema and initial data...")
    init_db()
    seed_sample_data()
    print("      ✓ Database ready at academic_system.db")
    
    print("[2/2] Starting local Flask development server...")
    print("      → Open your browser at: http://127.0.0.1:5000")
    print("      → Demo Student: student@example.edu  |  Password: student123")
    print("      → Administrator: admin  |  Password: admin123")
    print("=" * 70)
    print("Press CTRL+C to quit.\n")
    
    app.run(host='127.0.0.1', port=5000, debug=True)

if __name__ == '__main__':
    main()
