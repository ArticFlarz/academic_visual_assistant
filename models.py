import json
from datetime import datetime
from database import get_db_connection
from prioritization import rank_and_enrich_tasks

class UserModel:
    @staticmethod
    def get_by_id(user_id):
        conn = get_db_connection()
        user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        conn.close()
        return dict(user) if user else None

    @staticmethod
    def get_by_username_or_email(identifier):
        conn = get_db_connection()
        user = conn.execute(
            "SELECT * FROM users WHERE username = ? OR email = ?",
            (identifier, identifier)
        ).fetchone()
        conn.close()
        return dict(user) if user else None

    @staticmethod
    def create(username, email, password_hash, full_name, usn='', semester=3, role='student'):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (username, email, password_hash, full_name, usn, semester, role)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (username, email, password_hash, full_name, usn, semester, role))
        new_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return new_id

    @staticmethod
    def get_all_students_with_metrics():
        conn = get_db_connection()
        students = conn.execute(
            "SELECT id, username, email, full_name, usn, semester, created_at FROM users WHERE role = 'student' ORDER BY full_name ASC"
        ).fetchall()

        result = []
        for s in students:
            s_dict = dict(s)
            # Fetch tasks for this student
            raw_tasks = conn.execute("SELECT * FROM tasks WHERE user_id = ?", (s['id'],)).fetchall()
            task_dicts = [dict(t) for t in raw_tasks]
            enriched = rank_and_enrich_tasks(task_dicts)

            active_tasks = [t for t in enriched if t['status'] != 'Completed']
            completed_tasks = [t for t in enriched if t['status'] == 'Completed']
            active_hours = sum(float(t['estimated_hours']) for t in active_tasks)

            # Check if any task is critical or overdue
            critical_count = sum(1 for t in active_tasks if t.get('is_overdue') or t.get('priority_score', 0) >= 80)

            # Saved programs count
            prog_count = conn.execute("SELECT COUNT(*) as cnt FROM saved_programs WHERE user_id = ?", (s['id'],)).fetchone()['cnt']

            s_dict['total_tasks'] = len(task_dicts)
            s_dict['active_tasks_count'] = len(active_tasks)
            s_dict['completed_tasks_count'] = len(completed_tasks)
            s_dict['active_hours'] = round(active_hours, 1)
            s_dict['critical_tasks_count'] = critical_count
            s_dict['saved_programs_count'] = prog_count

            # Student Cognitive Health Status
            if active_hours > 20 or critical_count >= 2:
                s_dict['health_status'] = 'Cognitive Overload'
                s_dict['health_badge'] = 'critical'
            elif active_hours > 10 or critical_count == 1:
                s_dict['health_status'] = 'Moderate Load'
                s_dict['health_badge'] = 'high'
            else:
                s_dict['health_status'] = 'Healthy Balance'
                s_dict['health_badge'] = 'low'

            result.append(s_dict)

        conn.close()
        return result

    @staticmethod
    def get_system_overview():
        conn = get_db_connection()
        total_students = conn.execute("SELECT COUNT(*) as cnt FROM users WHERE role = 'student'").fetchone()['cnt']
        total_tasks = conn.execute("SELECT COUNT(*) as cnt FROM tasks").fetchone()['cnt']
        total_completed = conn.execute("SELECT COUNT(*) as cnt FROM tasks WHERE status = 'Completed'").fetchone()['cnt']
        total_programs = conn.execute("SELECT COUNT(*) as cnt FROM saved_programs").fetchone()['cnt']
        conn.close()

        return {
            'total_students': total_students,
            'total_tasks': total_tasks,
            'total_completed': total_completed,
            'total_programs': total_programs
        }

    @staticmethod
    def broadcast_task(title, description, course_code, category, deadline, estimated_hours, perceived_difficulty):
        """Allows administrator to broadcast a new assignment/lab to all registered students."""
        conn = get_db_connection()
        students = conn.execute("SELECT id FROM users WHERE role = 'student'").fetchall()
        created_count = 0

        for s in students:
            conn.execute("""
                INSERT INTO tasks (user_id, title, description, course_code, category, deadline, estimated_hours, perceived_difficulty, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
            """, (s['id'], title, description, course_code, category, deadline, estimated_hours, perceived_difficulty))
            created_count += 1

        conn.commit()
        conn.close()
        return created_count

    @staticmethod
    def delete_student(student_id):
        conn = get_db_connection()
        user = conn.execute("SELECT role FROM users WHERE id = ?", (student_id,)).fetchone()
        if not user or user['role'] != 'student':
            conn.close()
            return False
        conn.execute("DELETE FROM users WHERE id = ?", (student_id,))
        conn.commit()
        conn.close()
        return True

class TaskModel:
    @staticmethod
    def get_all_for_user(user_id, status_filter=None, category_filter=None):
        conn = get_db_connection()
        query = "SELECT * FROM tasks WHERE user_id = ?"
        params = [user_id]

        if status_filter and status_filter != 'all':
            query += " AND status = ?"
            params.append(status_filter)

        if category_filter and category_filter != 'all':
            query += " AND category = ?"
            params.append(category_filter)

        query += " ORDER BY deadline ASC"
        rows = conn.execute(query, params).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def get_by_id(task_id, user_id):
        conn = get_db_connection()
        row = conn.execute(
            "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
            (task_id, user_id)
        ).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def create(user_id, title, description, course_code, category, deadline, estimated_hours, perceived_difficulty, status='Pending'):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO tasks (user_id, title, description, course_code, category, deadline, estimated_hours, perceived_difficulty, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (user_id, title, description, course_code, category, deadline, estimated_hours, perceived_difficulty, status))
        new_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return new_id

    @staticmethod
    def update(task_id, user_id, **kwargs):
        allowed_fields = ['title', 'description', 'course_code', 'category', 'deadline', 'estimated_hours', 'perceived_difficulty', 'status']
        updates = []
        params = []
        for key, val in kwargs.items():
            if key in allowed_fields:
                updates.append(f"{key} = ?")
                params.append(val)

        if not updates:
            return False

        if 'status' in kwargs and kwargs['status'] == 'Completed':
            updates.append("completed_at = CURRENT_TIMESTAMP")
        elif 'status' in kwargs and kwargs['status'] != 'Completed':
            updates.append("completed_at = NULL")

        params.extend([task_id, user_id])
        query = f"UPDATE tasks SET {', '.join(updates)} WHERE id = ? AND user_id = ?"

        conn = get_db_connection()
        conn.execute(query, params)
        conn.commit()
        conn.close()
        return True

    @staticmethod
    def delete(task_id, user_id):
        conn = get_db_connection()
        conn.execute("DELETE FROM tasks WHERE id = ? AND user_id = ?", (task_id, user_id))
        conn.commit()
        conn.close()
        return True

class ProgramModel:
    @staticmethod
    def get_all_for_user(user_id):
        conn = get_db_connection()
        rows = conn.execute(
            "SELECT id, title, description, created_at, updated_at FROM saved_programs WHERE user_id = ? ORDER BY updated_at DESC",
            (user_id,)
        ).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def get_by_id(prog_id, user_id=None):
        conn = get_db_connection()
        if user_id:
            row = conn.execute(
                "SELECT * FROM saved_programs WHERE id = ? AND user_id = ?",
                (prog_id, user_id)
            ).fetchone()
        else:
            row = conn.execute("SELECT * FROM saved_programs WHERE id = ?", (prog_id,)).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def save_or_update(user_id, title, description, block_data, prog_id=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        block_json = json.dumps(block_data)

        if prog_id:
            cursor.execute("""
                UPDATE saved_programs
                SET title = ?, description = ?, block_data_json = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ? AND user_id = ?
            """, (title, description, block_json, prog_id, user_id))
            target_id = prog_id
        else:
            cursor.execute("""
                INSERT INTO saved_programs (user_id, title, description, block_data_json)
                VALUES (?, ?, ?, ?)
            """, (user_id, title, description, block_json))
            target_id = cursor.lastrowid

        conn.commit()
        conn.close()
        return target_id

    @staticmethod
    def delete(prog_id, user_id):
        conn = get_db_connection()
        conn.execute("DELETE FROM saved_programs WHERE id = ? AND user_id = ?", (prog_id, user_id))
        conn.commit()
        conn.close()
        return True
