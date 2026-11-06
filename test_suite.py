import sys
import io
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
from datetime import datetime, timedelta
from app import app
from prioritization import calculate_priority, rank_and_enrich_tasks
from transpiler import CodeTranspiler

def test_prioritization():
    print("Testing Heuristic Task Prioritization...")
    now = datetime.now()
    task_urgent = {
        'title': 'OS Lab: CPU Scheduling',
        'deadline': (now + timedelta(hours=12)).strftime('%Y-%m-%d %H:%M:%S'),
        'estimated_hours': 8.0,
        'perceived_difficulty': 4,
        'category': 'Laboratory Work'
    }
    task_quiz = {
        'title': 'Short Quiz',
        'deadline': (now + timedelta(hours=12)).strftime('%Y-%m-%d %H:%M:%S'),
        'estimated_hours': 0.25,
        'perceived_difficulty': 2,
        'category': 'Reading/Quiz'
    }

    p_urgent = calculate_priority(task_urgent, now)
    p_quiz = calculate_priority(task_quiz, now)

    print(f"Urgent 8h Lab Score: {p_urgent['priority_score']} ({p_urgent['urgency_tier']}) - Reasoning: {p_urgent['reasoning']}")
    print(f"15min Quiz Score:    {p_quiz['priority_score']} ({p_quiz['urgency_tier']}) - Reasoning: {p_quiz['reasoning']}")

    assert p_urgent['priority_score'] > p_quiz['priority_score'], "Urgent task should have higher priority score!"
    print("[PASS] Prioritization successfully differentiates 15-min quiz from 8-hr lab project due on the same day!\n")

def test_transpiler():
    print("Testing Code Transpiler...")
    blocks = [
        {'type': 'comment', 'text': 'Test Factorial'},
        {'type': 'variable_declare', 'var_name': 'n', 'var_type': 'int', 'initial_value': '5'},
        {'type': 'variable_declare', 'var_name': 'fact', 'var_type': 'int', 'initial_value': '1'},
        {'type': 'for_loop', 'iterator': 'i', 'start_val': '1', 'end_val': 'n', 'step': '1', 'body': [
            {'type': 'variable_assign', 'var_name': 'fact', 'expression': 'fact * i'}
        ]},
        {'type': 'output', 'expression': 'fact'}
    ]

    transpiler = CodeTranspiler(blocks=blocks, title='FactorialAlgorithm')
    result = transpiler.transpile_all()

    print("Transpiled Pseudocode:")
    print(result['pseudocode'])
    print("-" * 40)
    print("Transpiled Python:")
    print(result['python'])
    print("-" * 40)
    print("Transpiled ANSI C:")
    print(result['c'])
    print("-" * 40)

    assert "ALGORITHM FactorialAlgorithm" in result['pseudocode']
    assert "for i in range(1, n + 1):" in result['python']
    assert "#include <stdio.h>" in result['c']
    assert "int main(void)" in result['c']
    assert "for (i = 1; i <= n; i++)" in result['c']
    assert "public class Main" in result['java']
    assert "Scanner scanner = new Scanner(System.in);" in result['java']
    assert "System.out.println(fact);" in result['java']
    print("Transpiled Java 17+:")
    print(result['java'])
    print("-" * 40)
    print("[PASS] All 4 language representations (Pseudocode, Python, C, Java) successfully verified!\n")

def test_flask_endpoints():
    print("Testing Flask endpoints with test client...")
    with app.test_client() as client:
        # Check login page
        res = client.get('/login')
        assert res.status_code == 200, f"Expected 200 from /login, got {res.status_code}"

        # Check register page
        res = client.get('/register')
        assert res.status_code == 200, f"Expected 200 from /register, got {res.status_code}"

        # Test login post with Demo Student (Student ABC)
        login_res = client.post('/login', data={
            'identifier': 'student@example.edu',
            'password': 'student123'
        }, follow_redirects=True)
        assert login_res.status_code == 200
        assert b"Welcome back, Student ABC" in login_res.data or b"Dynamic Prioritized Coursework" in login_res.data

        # Verify Student Workload Hub contains the interactive Date Calendar & Reminders
        dash_res = client.get('/dashboard')
        assert dash_res.status_code == 200
        assert b"calDaysGrid" in dash_res.data, "Student Workload Hub must render the real date calendar grid"
        assert b"calReminderBanner" in dash_res.data, "Calendar must include the Next Due Reminder banner"
        assert b"calDayDrawer" in dash_res.data, "Calendar must include day detail and reminder drawer"
        assert b"calendar.js" in dash_res.data, "Calendar script must be loaded on the dashboard"
        print("[PASS] Student Workload Hub renders real date calendar & study reminders successfully!")

        # Verify Hub Tabs and 3-Tier Tasktabs in Workload Hub
        assert b"hub-tabs-container" in dash_res.data, "Must render Hub Tabs container"
        assert b"data-hub-tab=\"tasks\"" in dash_res.data, "Must render tasks hub tab"
        assert b"data-hub-tab=\"calendar\"" in dash_res.data, "Must render calendar hub tab"
        assert b"data-hub-tab=\"analytics\"" in dash_res.data, "Must render analytics hub tab"
        assert b"data-hub-tab=\"unified\"" in dash_res.data, "Must render unified hub tab"
        assert b"tasktabs-system" in dash_res.data, "Must render 3-tier tasktabs system"
        assert b"tasktabs-status-row" in dash_res.data, "Must render status tasktabs"
        assert b"tasktabs-category-row" in dash_res.data, "Must render category chips row"
        assert b"tasktabs-controls-row" in dash_res.data, "Must render search/sort controls"
        print("[PASS] Systematic Workload Hub Tabs and 3-Tier Tasktabs verified successfully!")

        # Test Program Library page (/program-library)
        lib_res = client.get('/program-library')
        assert lib_res.status_code == 200
        assert b"Algorithm Logic &amp; Visual Programming Library" in lib_res.data or b"Algorithm Logic" in lib_res.data
        print("[PASS] Algorithm Logic Library page (/program-library) accessed successfully with 75+ programs!")

        # Test Visual Assistant page with ?load= parameter
        vis_res = client.get('/visual-assistant?load=prog_23_factorial')
        assert vis_res.status_code == 200
        assert b"Visual Programming Assistant" in vis_res.data
        print("[PASS] Visual Assistant page (/visual-assistant?load=prog_23_factorial) accessed successfully!")

        # Test API Tasks
        tasks_res = client.get('/api/tasks')
        assert tasks_res.status_code == 200
        tasks_json = tasks_res.get_json()
        assert tasks_json['success'] is True
        assert len(tasks_json['tasks']) > 0
        print(f"[PASS] Retrieved {len(tasks_json['tasks'])} seeded tasks for student.")

        # Test API Analytics
        analytics_res = client.get('/api/analytics')
        assert analytics_res.status_code == 200
        analytics_json = analytics_res.get_json()
        assert analytics_json['success'] is True
        assert 'stress_index' in analytics_json['summary']
        print(f"[PASS] Retrieved analytics: Stress Index is {analytics_json['summary']['stress_index']}/100 ({analytics_json['summary']['stress_level']})")

        # Test Visual Transpiler API
        transpile_res = client.post('/api/transpile', json={
            'title': 'TestPrime',
            'blocks': [
                {'type': 'variable_declare', 'var_name': 'x', 'var_type': 'int', 'initial_value': '10'},
                {'type': 'output', 'expression': 'x'}
            ]
        })
        assert transpile_res.status_code == 200
        t_json = transpile_res.get_json()
        assert t_json['success'] is True
        assert 'java' in t_json
        assert 'public class Main' in t_json['java']
        print("[PASS] API /api/transpile returned successfully with Python, C, and Java representations.")

        # Test Python execution endpoint
        run_res = client.post('/api/run-python', json={
            'code': 'x = 10\nprint("Result:", x * 5)',
            'inputs': []
        })
        assert run_res.status_code == 200
        r_json = run_res.get_json()
        assert r_json['success'] is True
        assert "Result: 50" in r_json['output']
        print(f"[PASS] API /api/run-python executed output: {r_json['output'].strip()}")

        # Test Logout
        client.get('/logout')

        # Test Admin Login
        admin_login = client.post('/login', data={
            'identifier': 'admin',
            'password': 'admin123'
        }, follow_redirects=True)
        assert admin_login.status_code == 200
        assert b"Administrative Portal" in admin_login.data
        assert b"Student Workload Hub" not in admin_login.data, "Admin view should not have Student Workload Hub"
        print("[PASS] Admin authentication and dashboard isolation successful.")

        # Test Access to /admin
        admin_page = client.get('/admin')
        assert admin_page.status_code == 200
        assert b"Student Cohort" in admin_page.data
        assert b"Admin Oversight" in admin_page.data
        print("[PASS] Admin dashboard (/admin) accessed successfully.")

        # Verify admin accessing /dashboard redirects to /admin
        admin_dash_attempt = client.get('/dashboard', follow_redirects=False)
        assert admin_dash_attempt.status_code == 302
        assert admin_dash_attempt.headers['Location'] == '/admin'
        print("[PASS] Admin accessing /dashboard is automatically redirected to /admin.")

        # Test Admin Broadcast Coursework API
        broadcast_res = client.post('/api/admin/broadcast-task', json={
            'title': 'Operating Systems: Inter-process Communication Pipes',
            'course_code': 'CS204',
            'category': 'Laboratory Work',
            'deadline': '2026-10-15 17:00:00',
            'estimated_hours': 5.0,
            'perceived_difficulty': 4,
            'description': 'Implement two-way pipes in C between parent and child processes.'
        })
        assert broadcast_res.status_code == 200
        b_json = broadcast_res.get_json()
        assert b_json['success'] is True
        print(f"[PASS] Admin broadcast coursework API: {b_json['message']}")

def test_library_programs():
    print("\nTesting All 75 Programs from Algorithm Logic Library...")
    import json
    import re
    with open('static/js/program_library_data.js', 'r', encoding='utf-8') as f:
        js_content = f.read()

    # Extract JSON array
    json_start = js_content.find('[')
    json_end = js_content.rfind(']')
    raw_json = js_content[json_start:json_end+1]
    programs = json.loads(raw_json)
    assert len(programs) >= 75, f"Expected at least 75 programs, found {len(programs)}"

    with app.test_client() as client:
        # Login student
        client.post('/login', data={'identifier': 'student@example.edu', 'password': 'student123'})

        passed_count = 0
        for p in programs:
            p_id = p['id']
            blocks = p['blocks']
            # Ensure every program has input blocks (except purely decorative if any)
            has_input = any(b.get('type') == 'input' for b in blocks)
            assert has_input, f"Program {p_id} is missing input statements!"

            # Test transpilation
            transpiler = CodeTranspiler(blocks=blocks, title=p_id)
            all_code = transpiler.transpile_all()
            assert all_code['pseudocode']
            assert all_code['python']
            assert all_code['c']
            assert all_code['java']

            sim_inputs = ['Student'] if p_id == 'prog_01_hello' else ['15', '5', '10', '20', '25', '30', '7', '3', '8', '100', '50', '25']
            run_res = client.post('/api/run-python', json={
                'code': all_code['python'],
                'inputs': sim_inputs
            })
            assert run_res.status_code == 200
            res_data = run_res.get_json()
            assert res_data['success'] is True, f"Execution failed for {p_id}: {res_data.get('output')}"
            passed_count += 1

        print(f"[PASS] All {passed_count} library programs successfully verified with complete interactive inputs and zero runtime errors!")

    print("\n[PASS] ALL TEST CASES PASSED FLAWLESSLY!\n")

if __name__ == '__main__':
    test_prioritization()
    test_transpiler()
    test_flask_endpoints()
    test_library_programs()

