import sqlite3
import os
import json
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
from config import Config

def get_db_connection():
    """Establishes an SQLite database connection with row access by column name."""
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    """Initializes database schema with ACID compliance and indexes."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        usn TEXT,
        semester INTEGER DEFAULT 3,
        role TEXT DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Safe migration: add role column if missing from earlier table creation
    cursor.execute("PRAGMA table_info(users)")
    columns = [row['name'] for row in cursor.fetchall()]
    if 'role' not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'student';")

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        course_code TEXT,
        category TEXT NOT NULL,
        deadline TIMESTAMP NOT NULL,
        estimated_hours REAL NOT NULL,
        perceived_difficulty INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS saved_programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        block_data_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    """)

    cursor.execute("CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_programs_user ON saved_programs(user_id);")

    conn.commit()
    conn.close()

def seed_sample_data():
    """Seeds realistic undergraduate student profiles, admin account, and academic tasks using generic example identifiers."""
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now()

    # 1. Seed Admin Account
    cursor.execute("SELECT id FROM users WHERE username = ? OR email = ?", ('admin', 'admin@example.edu'))
    existing_admin = cursor.fetchone()

    if not existing_admin:
        hashed_admin_pw = generate_password_hash('admin123')
        cursor.execute("""
        INSERT INTO users (username, email, password_hash, full_name, usn, semester, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, ('admin', 'admin@example.edu', hashed_admin_pw, 'System Administrator', 'ADM-001', 0, 'admin'))
        print("Created seed Admin account: System Administrator (admin / admin123)")

    # 2. Seed Primary Demo Student (Student ABC)
    cursor.execute("SELECT id FROM users WHERE email = ? OR username = ?", ('student@example.edu', 'student_abc'))
    existing_student = cursor.fetchone()

    if not existing_student:
        hashed_pw = generate_password_hash('student123')
        cursor.execute("""
        INSERT INTO users (username, email, password_hash, full_name, usn, semester, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, ('student_abc', 'student@example.edu', hashed_pw, 'Student ABC', 'USN-ABC-01', 3, 'student'))
        user_id = cursor.lastrowid
        print(f"Created seed user: Student ABC (ID: {user_id})")

        sample_tasks = [
            (
                user_id,
                "OS Lab: Round Robin & Priority CPU Scheduling",
                "Implement and analyze preemptive Round Robin and priority scheduling in C with turnaround and waiting time metrics.",
                "CS204",
                "Laboratory Work",
                (now + timedelta(hours=26)).strftime("%Y-%m-%d %H:%M:%S"),
                7.5,
                4,
                "In Progress",
                None
            ),
            (
                user_id,
                "Data Structures: Balanced AVL & Red-Black Trees",
                "Implement self-balancing binary search trees with left-right rotations and benchmark search latency.",
                "CS201",
                "Project",
                (now + timedelta(days=3, hours=4)).strftime("%Y-%m-%d %H:%M:%S"),
                11.0,
                5,
                "Pending",
                None
            ),
            (
                user_id,
                "Discrete Mathematics: Graph Theory Midterm Prep",
                "Prepare Eulerian paths, Hamiltonian cycles, planar graphs, and chromatic number proofs.",
                "MAT201",
                "Examination",
                (now + timedelta(days=5, hours=8)).strftime("%Y-%m-%d %H:%M:%S"),
                9.0,
                4,
                "Pending",
                None
            ),
            (
                user_id,
                "Python Programming: File I/O & Exception Handling Quiz",
                "Short 15-minute conceptual quiz on context managers and try-except blocks.",
                "CS102",
                "Reading/Quiz",
                (now + timedelta(hours=22)).strftime("%Y-%m-%d %H:%M:%S"),
                0.5,
                2,
                "Pending",
                None
            ),
            (
                user_id,
                "Computer Networks: VLSM Subnetting & Packet Tracer",
                "Design IP addressing scheme for 4 subnets and verify routing tables in Cisco Packet Tracer.",
                "CS205",
                "Assignment",
                (now + timedelta(days=4, hours=12)).strftime("%Y-%m-%d %H:%M:%S"),
                3.5,
                3,
                "Pending",
                None
            ),
            (
                user_id,
                "Digital Logic: 4-Bit Synchronous ALU Simulation",
                "Construct arithmetic logic unit truth table and verify ripple-carry adder in Logisim.",
                "CS203",
                "Laboratory Work",
                (now - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S"),
                4.0,
                3,
                "Completed",
                (now - timedelta(hours=8)).strftime("%Y-%m-%d %H:%M:%S")
            )
        ]

        cursor.executemany("""
        INSERT INTO tasks (user_id, title, description, course_code, category, deadline, estimated_hours, perceived_difficulty, status, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, sample_tasks)

        # Pre-seed Factorial Calculator visual program
        factorial_blocks = [
            {"type": "comment", "text": "Compute Factorial of N using a loop"},
            {"type": "input", "var_name": "n", "var_type": "int", "prompt": "Enter a number to find factorial:"},
            {"type": "variable_declare", "var_name": "fact", "var_type": "int", "initial_value": "1"},
            {
                "type": "for_loop",
                "iterator": "i",
                "start_val": "1",
                "end_val": "n",
                "step": "1",
                "body": [
                    {"type": "variable_assign", "var_name": "fact", "expression": "fact * i"}
                ]
            },
            {"type": "output", "expression": '"Factorial is " + fact'}
        ]

        cursor.execute("""
        INSERT INTO saved_programs (user_id, title, description, block_data_json)
        VALUES (?, ?, ?, ?)
        """, (user_id, "Factorial Computation", "Calculates the factorial of an integer n using an iterative loop", json.dumps(factorial_blocks)))

    # 3. Seed other Cohort Students for Administrative oversight
    cohort_students = [
        ('student_b', 'student_b@example.edu', 'Student B', 'USN-ABC-02'),
        ('student_c', 'student_c@example.edu', 'Student C', 'USN-ABC-03'),
        ('student_d', 'student_d@example.edu', 'Student D', 'USN-ABC-04')
    ]

    for uname, email, name, usn in cohort_students:
        cursor.execute("SELECT id FROM users WHERE username = ? OR email = ?", (uname, email))
        if not cursor.fetchone():
            pw = generate_password_hash('student123')
            cursor.execute("""
            INSERT INTO users (username, email, password_hash, full_name, usn, semester, role)
            VALUES (?, ?, ?, ?, ?, ?, 'student')
            """, (uname, email, pw, name, usn, 3))
            s_id = cursor.lastrowid
            
            # Add a couple tasks for each student
            cursor.execute("""
            INSERT INTO tasks (user_id, title, description, course_code, category, deadline, estimated_hours, perceived_difficulty, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (s_id, "OS Lab: Round Robin Scheduling", "Coursework Lab Assignment", "CS204", "Laboratory Work", (now + timedelta(hours=30)).strftime("%Y-%m-%d %H:%M:%S"), 6.0, 4, "Pending"))

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    seed_sample_data()
    print("Database initialized and sample data seeded successfully.")
