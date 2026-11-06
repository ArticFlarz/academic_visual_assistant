import os
import sys
import io
import json
import contextlib
from datetime import datetime, timedelta
from functools import wraps
from flask import (
    Flask, render_template, request, redirect, url_for,
    session, jsonify, flash
)
from werkzeug.security import generate_password_hash, check_password_hash

from config import Config
from database import init_db, seed_sample_data
from models import UserModel, TaskModel, ProgramModel
from prioritization import calculate_priority, rank_and_enrich_tasks
from transpiler import CodeTranspiler

app = Flask(__name__)
app.config.from_object(Config)

# Ensure database is created and seeded upon startup
with app.app_context():
    init_db()
    seed_sample_data()

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash("Please sign in to access your academic dashboard.", "info")
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash("Admin sign in required.", "info")
            return redirect(url_for('admin_login', next=request.url))
        user = UserModel.get_by_id(session['user_id'])
        if not user or user.get('role') != 'admin':
            flash("Access denied: Administrative privileges required.", "danger")
            return redirect(url_for('dashboard'))
        return f(*args, **kwargs)
    return decorated_function

@app.context_processor
def inject_user():
    user = None
    if 'user_id' in session:
        user = UserModel.get_by_id(session['user_id'])
    return dict(current_user=user)

# ==========================================
# AUTHENTICATION ROUTES
# ==========================================

@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        user = UserModel.get_by_id(session['user_id'])
        if user and user.get('role') == 'admin':
            return redirect(url_for('admin_dashboard'))
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        identifier = request.form.get('identifier', '').strip()
        password = request.form.get('password', '').strip()

        user = UserModel.get_by_username_or_email(identifier)
        if user and check_password_hash(user['password_hash'], password):
            session['user_id'] = user['id']
            session['username'] = user['username']
            session['full_name'] = user['full_name']
            session['role'] = user.get('role', 'student')
            flash(f"Welcome back, {user['full_name']}! 🌱", "success")
            
            next_url = request.args.get('next')
            if user.get('role') == 'admin':
                return redirect(next_url or url_for('admin_dashboard'))
            return redirect(next_url or url_for('dashboard'))
        else:
            flash("Invalid username/email or password. Please verify and try again.", "danger")

    return render_template('login.html')

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if 'user_id' in session:
        user = UserModel.get_by_id(session['user_id'])
        if user and user.get('role') == 'admin':
            return redirect(url_for('admin_dashboard'))
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        identifier = request.form.get('identifier', '').strip()
        password = request.form.get('password', '').strip()

        user = UserModel.get_by_username_or_email(identifier)
        if user and user.get('role') == 'admin' and check_password_hash(user['password_hash'], password):
            session['user_id'] = user['id']
            session['username'] = user['username']
            session['full_name'] = user['full_name']
            session['role'] = 'admin'
            flash(f"Welcome to Admin Oversight, {user['full_name']}! 🛡️", "success")
            return redirect(url_for('admin_dashboard'))
        else:
            flash("Invalid administrative credentials. Access restricted to authorized administrators.", "danger")

    return render_template('admin_login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        full_name = request.form.get('full_name', '').strip()
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip()
        usn = request.form.get('usn', '').strip().upper()
        semester = int(request.form.get('semester', 3))
        password = request.form.get('password', '').strip()
        confirm_password = request.form.get('confirm_password', '').strip()

        if not full_name or not username or not email or not password:
            flash("Please fill in all mandatory fields.", "warning")
            return render_template('register.html')

        if password != confirm_password:
            flash("Passwords do not match. Please re-enter.", "warning")
            return render_template('register.html')

        if UserModel.get_by_username_or_email(username) or UserModel.get_by_username_or_email(email):
            flash("Username or Email already registered. Please login.", "warning")
            return render_template('register.html')

        pw_hash = generate_password_hash(password)
        new_id = UserModel.create(username, email, pw_hash, full_name, usn, semester)
        session['user_id'] = new_id
        session['username'] = username
        session['full_name'] = full_name
        flash("Your account has been created successfully! Welcome to your learning hub.", "success")
        return redirect(url_for('dashboard'))

    return render_template('register.html')

@app.route('/logout')
def logout():
    session.clear()
    flash("You have been signed out safely. Take care!", "info")
    return redirect(url_for('login'))

# ==========================================
# PAGE VIEWS
# ==========================================

@app.route('/')
def index():
    if 'user_id' in session:
        if session.get('role') == 'admin':
            return redirect(url_for('admin_dashboard'))
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    if session.get('role') == 'admin':
        return redirect(url_for('admin_dashboard'))
    return render_template('dashboard.html')

@app.route('/admin')
@admin_required
def admin_dashboard():
    stats = UserModel.get_system_overview()
    students = UserModel.get_all_students_with_metrics()
    return render_template('admin_dashboard.html', stats=stats, students=students)

@app.route('/api/admin/broadcast-task', methods=['POST'])
@admin_required
def admin_broadcast_task():
    data = request.get_json() or request.form
    title = data.get('title', '').strip()
    if not title:
        return jsonify({'success': False, 'error': 'Task title is required.'}), 400

    description = data.get('description', '').strip()
    course_code = data.get('course_code', 'CS204').strip().upper()
    category = data.get('category', 'Laboratory Work')
    deadline = data.get('deadline')
    estimated_hours = float(data.get('estimated_hours', 4.0))
    perceived_difficulty = int(data.get('perceived_difficulty', 3))

    count = UserModel.broadcast_task(title, description, course_code, category, deadline, estimated_hours, perceived_difficulty)
    return jsonify({'success': True, 'message': f'Coursework published to {count} students successfully!'})

@app.route('/api/admin/student/<int:student_id>', methods=['GET'])
@admin_required
def admin_student_details(student_id):
    student = UserModel.get_by_id(student_id)
    if not student:
        return jsonify({'success': False, 'error': 'Student not found'}), 404
    tasks = TaskModel.get_all_for_user(student_id)
    enriched = rank_and_enrich_tasks(tasks)
    programs = ProgramModel.get_all_for_user(student_id)
    return jsonify({'success': True, 'student': student, 'tasks': enriched, 'programs': programs})

@app.route('/api/admin/students', methods=['POST'])
@admin_required
def admin_add_student():
    data = request.get_json() or request.form
    full_name = data.get('full_name', '').strip()
    email = data.get('email', '').strip()
    usn = data.get('usn', '').strip().upper()
    username = data.get('username', '').strip() or email.split('@')[0]
    semester = int(data.get('semester', 3))
    password = data.get('password', '').strip() or 'student123'

    if not full_name or not email:
        return jsonify({'success': False, 'error': 'Candidate name and email are mandatory.'}), 400

    if UserModel.get_by_username_or_email(username) or UserModel.get_by_username_or_email(email):
        return jsonify({'success': False, 'error': 'A candidate with this username or email is already enrolled.'}), 400

    pw_hash = generate_password_hash(password)
    new_id = UserModel.create(username, email, pw_hash, full_name, usn, semester, role='student')
    return jsonify({
        'success': True,
        'message': f'Candidate {full_name} enrolled successfully!',
        'student_id': new_id
    })

@app.route('/api/admin/student/<int:student_id>', methods=['DELETE'])
@admin_required
def admin_remove_student(student_id):
    success = UserModel.delete_student(student_id)
    if not success:
        return jsonify({'success': False, 'error': 'Candidate could not be removed or not found.'}), 404
    return jsonify({'success': True, 'message': 'Candidate successfully removed from cohort.'})

@app.route('/visual-assistant')
@login_required
def visual_assistant():
    return render_template('visual_coder.html')

@app.route('/program-library')
@login_required
def program_library():
    return render_template('program_library.html')

# ==========================================
# TASK PRIORITIZATION & CRUD API
# ==========================================

@app.route('/api/tasks', methods=['GET'])
@login_required
def get_tasks():
    status = request.args.get('status', 'all')
    category = request.args.get('category', 'all')
    raw_tasks = TaskModel.get_all_for_user(session['user_id'], status, category)
    ranked_tasks = rank_and_enrich_tasks(raw_tasks)
    return jsonify({'success': True, 'tasks': ranked_tasks})

@app.route('/api/tasks', methods=['POST'])
@login_required
def create_task():
    data = request.get_json() or request.form
    title = data.get('title', '').strip()
    if not title:
        return jsonify({'success': False, 'error': 'Task title is required.'}), 400

    description = data.get('description', '').strip()
    course_code = data.get('course_code', '').strip().upper()
    category = data.get('category', 'Assignment')
    deadline = data.get('deadline')
    estimated_hours = float(data.get('estimated_hours', 2.0))
    perceived_difficulty = int(data.get('perceived_difficulty', 3))
    status = data.get('status', 'Pending')

    new_id = TaskModel.create(
        user_id=session['user_id'],
        title=title,
        description=description,
        course_code=course_code,
        category=category,
        deadline=deadline,
        estimated_hours=estimated_hours,
        perceived_difficulty=perceived_difficulty,
        status=status
    )

    created = TaskModel.get_by_id(new_id, session['user_id'])
    enriched = rank_and_enrich_tasks([created])[0]
    return jsonify({'success': True, 'task': enriched, 'message': 'Academic task successfully logged.'})

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
@login_required
def update_task(task_id):
    data = request.get_json() or {}
    success = TaskModel.update(task_id, session['user_id'], **data)
    if not success:
        return jsonify({'success': False, 'error': 'Task could not be updated or not found.'}), 404

    updated = TaskModel.get_by_id(task_id, session['user_id'])
    enriched = rank_and_enrich_tasks([updated])[0]
    return jsonify({'success': True, 'task': enriched, 'message': 'Task updated successfully.'})

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
@login_required
def delete_task(task_id):
    TaskModel.delete(task_id, session['user_id'])
    return jsonify({'success': True, 'message': 'Task removed from your schedule.'})

@app.route('/api/tasks/<int:task_id>/toggle-status', methods=['POST'])
@login_required
def toggle_task_status(task_id):
    task = TaskModel.get_by_id(task_id, session['user_id'])
    if not task:
        return jsonify({'success': False, 'error': 'Task not found'}), 404

    current_status = task['status']
    if current_status == 'Pending':
        next_status = 'In Progress'
    elif current_status == 'In Progress':
        next_status = 'Completed'
    else:
        next_status = 'Pending'

    TaskModel.update(task_id, session['user_id'], status=next_status)
    updated = TaskModel.get_by_id(task_id, session['user_id'])
    enriched = rank_and_enrich_tasks([updated])[0]
    return jsonify({'success': True, 'task': enriched, 'new_status': next_status})

# ==========================================
# CHART.JS ANALYTICS API
# ==========================================

@app.route('/api/analytics', methods=['GET'])
@login_required
def get_analytics():
    raw_tasks = TaskModel.get_all_for_user(session['user_id'])
    ranked = rank_and_enrich_tasks(raw_tasks)

    # 1. Status counts & Hours
    status_counts = {'Pending': 0, 'In Progress': 0, 'Completed': 0}
    category_hours = {'Assignment': 0.0, 'Laboratory Work': 0.0, 'Project': 0.0, 'Examination': 0.0, 'Reading/Quiz': 0.0}
    category_counts = {'Assignment': 0, 'Laboratory Work': 0, 'Project': 0, 'Examination': 0, 'Reading/Quiz': 0}

    # 2. Priority Urgency Tier Distribution
    urgency_distribution = {'Critical / Overdue': 0, 'Immediate Action': 0, 'High Urgency': 0, 'Moderate': 0, 'Low Horizon': 0}

    active_tasks = [t for t in ranked if t['status'] != 'Completed']
    completed_tasks = [t for t in ranked if t['status'] == 'Completed']

    total_est_hours_active = 0.0
    total_est_hours_all = 0.0

    for t in ranked:
        st = t['status']
        status_counts[st] = status_counts.get(st, 0) + 1
        cat = t['category']
        hrs = float(t['estimated_hours'])
        total_est_hours_all += hrs

        if cat in category_hours:
            category_hours[cat] += hrs
            category_counts[cat] += 1

        if st != 'Completed':
            total_est_hours_active += hrs
            tier = t['urgency_tier']
            if tier in urgency_distribution:
                urgency_distribution[tier] += 1

    # 3. 7-Day Academic Cognitive Load Forecast
    today = datetime.now().date()
    daily_hours = {}
    day_labels = []
    for i in range(7):
        d = today + timedelta(days=i)
        d_str = d.strftime("%a (%b %d)")
        day_labels.append(d_str)
        daily_hours[d.strftime("%Y-%m-%d")] = 0.0

    for t in active_tasks:
        try:
            d_time = datetime.strptime(str(t['deadline']).split()[0], "%Y-%m-%d").date()
            d_str = d_time.strftime("%Y-%m-%d")
            if d_str in daily_hours:
                daily_hours[d_str] += float(t['estimated_hours'])
        except Exception:
            pass

    timeline_data = list(daily_hours.values())

    # 4. Cognitive Stress Index Calculation (0 - 100)
    # A healthy weekly workload for undergraduate students is ~20-25 hrs of outside study.
    # High urgency tasks multiply stress.
    urgent_weight = (urgency_distribution['Critical / Overdue'] * 25) + \
                    (urgency_distribution['Immediate Action'] * 15) + \
                    (urgency_distribution['High Urgency'] * 8)

    hours_factor = min(50, (total_est_hours_active / 30.0) * 50)
    stress_index = min(100, round(hours_factor + urgent_weight))

    if stress_index >= 75:
        stress_level = "High Cognitive Load"
        stress_color = "#E07A5F"
        stress_msg = "Overloaded: Multiple high-effort deadlines overlapping. Focus only on top 2 urgent items; defer optional tasks."
    elif stress_index >= 45:
        stress_level = "Moderate Workload"
        stress_color = "#E08E45"
        stress_msg = "Steady pace: Workload is substantial but manageable with disciplined 2-hour daily study blocks."
    else:
        stress_level = "Healthy Balance"
        stress_color = "#4E7D63"
        stress_msg = "Smooth sailing: Great balance! An ideal window to explore visual algorithms or study ahead."

    # 5. Quick Wins (Tasks requiring <= 2 hours to complete easily)
    quick_wins = [t for t in active_tasks if t['estimated_hours'] <= 2.0][:3]

    return jsonify({
        'success': True,
        'summary': {
            'total_tasks': len(ranked),
            'active_tasks': len(active_tasks),
            'completed_tasks': len(completed_tasks),
            'total_active_hours': round(total_est_hours_active, 1),
            'completion_rate': round((len(completed_tasks) / max(1, len(ranked))) * 100, 1),
            'stress_index': stress_index,
            'stress_level': stress_level,
            'stress_color': stress_color,
            'stress_msg': stress_msg
        },
        'status_counts': status_counts,
        'category_hours': category_hours,
        'urgency_distribution': urgency_distribution,
        'timeline': {
            'labels': day_labels,
            'hours': timeline_data,
            'sustainable_cap': 4.5
        },
        'quick_wins': quick_wins
    })

# ==========================================
# TRANSPILER & VISUAL PROGRAMMING API
# ==========================================

@app.route('/api/transpile', methods=['POST'])
@login_required
def transpile():
    data = request.get_json() or {}
    blocks = data.get('blocks', [])
    title = data.get('title', 'MyAlgorithm')

    transpiler = CodeTranspiler(blocks=blocks, title=title)
    result = transpiler.transpile_all()
    return jsonify({
        'success': True,
        'pseudocode': result['pseudocode'],
        'python': result['python'],
        'c': result['c'],
        'java': result['java']
    })

@app.route('/api/run-python', methods=['POST'])
@login_required
def run_python_code():
    """
    Safely executes generated Python code in a restricted namespace with captured stdout.
    Gives students instant feedback on their algorithm logic.
    """
    data = request.get_json() or {}
    code = data.get('code', '')
    simulated_inputs = data.get('inputs', [])

    if not code.strip():
        return jsonify({'success': False, 'output': 'No code to execute.'})

    # Input feeder
    input_idx = 0
    input_calls = 0
    def mock_input(prompt=''):
        nonlocal input_idx, input_calls
        input_calls += 1
        if input_calls > 50:
            raise RuntimeError("Maximum terminal input calls exceeded (50). Check loop conditions.")
        if prompt:
            print(prompt, end='')
        if input_idx < len(simulated_inputs):
            val = str(simulated_inputs[input_idx])
            input_idx += 1
            if prompt:
                print(f" {val}")
            return val
        if prompt:
            print(" 5")
        return "5"

    output_lines = 0
    def safe_print(*args, **kwargs):
        nonlocal output_lines
        output_lines += 1
        if output_lines > 300:
            raise RuntimeError("Maximum terminal output limit reached (300 lines). Check loop bounds.")
        print(*args, **kwargs)

    # Safe builtins
    safe_builtins = {
        'print': safe_print,
        'input': mock_input,
        'range': range,
        'len': len,
        'int': int,
        'float': float,
        'str': str,
        'bool': bool,
        'abs': abs,
        'min': min,
        'max': max,
        'round': round,
        'sum': sum,
        'True': True,
        'False': False,
        'None': None
    }

    stdout_capture = io.StringIO()
    exec_globals = {'__builtins__': safe_builtins}
    exec_locals = {}

    try:
        with contextlib.redirect_stdout(stdout_capture):
            exec(code, exec_globals, exec_locals)
        output = stdout_capture.getvalue()
        if not output.strip():
            output = "[Execution completed with no printed output. Use an Output block to see values!]"
        return jsonify({'success': True, 'output': output})
    except Exception as e:
        return jsonify({
            'success': False,
            'output': f"Runtime Error: {type(e).__name__}: {str(e)}\n\nTip: Double check variable declarations and loop bounds."
        })

@app.route('/api/programs', methods=['GET'])
@login_required
def list_programs():
    progs = ProgramModel.get_all_for_user(session['user_id'])
    return jsonify({'success': True, 'programs': progs})

@app.route('/api/programs/<int:prog_id>', methods=['GET'])
@login_required
def get_program(prog_id):
    prog = ProgramModel.get_by_id(prog_id, session['user_id'])
    if not prog:
        return jsonify({'success': False, 'error': 'Program not found'}), 404
    return jsonify({'success': True, 'program': prog})

@app.route('/api/programs', methods=['POST'])
@login_required
def save_program():
    data = request.get_json() or {}
    title = data.get('title', 'Untitled Algorithm').strip()
    description = data.get('description', '').strip()
    block_data = data.get('blocks', [])
    prog_id = data.get('id')

    saved_id = ProgramModel.save_or_update(
        user_id=session['user_id'],
        title=title,
        description=description,
        block_data=block_data,
        prog_id=prog_id
    )

    return jsonify({'success': True, 'id': saved_id, 'message': 'Algorithm logic saved successfully!'})

@app.route('/api/programs/<int:prog_id>', methods=['DELETE'])
@login_required
def delete_program(prog_id):
    ProgramModel.delete(prog_id, session['user_id'])
    return jsonify({'success': True, 'message': 'Saved program removed.'})

if __name__ == '__main__':
    # Default port 5000, debug mode enabled
    app.run(host='127.0.0.1', port=5000, debug=True)
