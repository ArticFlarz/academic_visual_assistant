import math
from datetime import datetime, timezone

CATEGORY_WEIGHTS = {
    'Examination': 1.50,
    'Project': 1.35,
    'Laboratory Work': 1.25,
    'Assignment': 1.10,
    'Reading/Quiz': 1.00
}

def calculate_priority(task, current_time=None):
    """
    Calculates dynamic heuristic priority score (0-100) based on:
    - Deadline proximity vs. Estimated completion hours (Workload Pressure Ratio)
    - Perceived difficulty (1 to 5)
    - Academic task category weight (Exam > Project > Lab > Assignment > Quiz)
    - Overdue state penalty

    Addresses the core limitation identified in System Requirements Specification:
    "Existing tools do not differentiate between a 15-minute quiz and a 10-hour lab project due on the same day."
    """
    if current_time is None:
        current_time = datetime.now()

    # Parse task deadline
    deadline_val = task['deadline']
    if isinstance(deadline_val, str):
        try:
            deadline = datetime.fromisoformat(deadline_val.replace('Z', '+00:00'))
            if deadline.tzinfo is not None:
                deadline = deadline.astimezone().replace(tzinfo=None)
        except Exception:
            try:
                deadline = datetime.strptime(deadline_val, "%Y-%m-%d %H:%M:%S")
            except Exception:
                deadline = datetime.strptime(deadline_val, "%Y-%m-%dT%H:%M")
    else:
        deadline = deadline_val

    est_hours = float(task.get('estimated_hours', 1.0))
    if est_hours <= 0:
        est_hours = 0.5

    difficulty = int(task.get('perceived_difficulty', 3))
    difficulty = max(1, min(5, difficulty))

    category = task.get('category', 'Assignment')
    cat_weight = CATEGORY_WEIGHTS.get(category, 1.10)

    # Time remaining in hours
    delta = deadline - current_time
    remaining_hours = delta.total_seconds() / 3600.0

    is_overdue = remaining_hours < 0
    is_completed = task.get('status') == 'Completed'

    if is_completed:
        return {
            'priority_score': 0,
            'urgency_tier': 'Completed',
            'badge_color': 'completed',
            'remaining_hours': round(remaining_hours, 1),
            'remaining_text': 'Completed',
            'pressure_ratio': 0.0,
            'reasoning': 'Task successfully finished and archived.',
            'recommendation': 'Great work! Take a mindful breather or review upcoming tasks.',
            'is_overdue': False
        }

    # Format human-friendly remaining text
    if is_overdue:
        overdue_hours = abs(remaining_hours)
        if overdue_hours < 24:
            remaining_text = f"Overdue by {math.floor(overdue_hours)}h {int((overdue_hours % 1) * 60)}m"
        else:
            remaining_text = f"Overdue by {round(overdue_hours / 24, 1)} days"
    else:
        if remaining_hours < 1:
            remaining_text = f"Due in {int(remaining_hours * 60)} mins"
        elif remaining_hours < 24:
            remaining_text = f"Due in {math.floor(remaining_hours)}h {int((remaining_hours % 1) * 60)}m"
        elif remaining_hours < 48:
            remaining_text = f"Due tomorrow (~{round(remaining_hours, 0):.0f}h left)"
        else:
            remaining_text = f"Due in {round(remaining_hours / 24, 1)} days"

    if is_overdue:
        # Overdue tasks take highest urgency
        overdue_days = abs(remaining_hours) / 24.0
        priority_score = min(100, 92 + math.log1p(overdue_days) * 4 + (difficulty * 0.8))
        priority_score = round(priority_score, 1)

        return {
            'priority_score': priority_score,
            'urgency_tier': 'Critical / Overdue',
            'badge_color': 'critical',
            'remaining_hours': round(remaining_hours, 1),
            'remaining_text': remaining_text,
            'pressure_ratio': 1.0,
            'reasoning': f"Deadline expired! Demands {est_hours:.1f} hours of focused work immediately.",
            'recommendation': f"Prioritize right now: dedicate a focused {min(est_hours, 2.0):.1f}h sprint to wrap this up or submit partial work.",
            'is_overdue': True
        }

    # Pressure ratio: What fraction of the remaining window is needed just to finish?
    # e.g., if 8 hours needed and 16 hours left, pressure = 0.50 (50% of available time!)
    effective_window = max(0.2, remaining_hours)
    pressure_ratio = min(2.0, est_hours / effective_window)

    # Difficulty multiplier (1 -> 1.0, 5 -> 1.56)
    diff_factor = 1.0 + 0.14 * (difficulty - 1)

    # Deadline proximity factor (peaks as deadline nears)
    # Scaled to accentuate items due in < 48 hours
    proximity_factor = 48.0 / (remaining_hours + 16.0)

    # Heuristic raw score computation
    # Component 1: Workload pressure (40%)
    # Component 2: Deadline proximity (30%)
    # Component 3: Difficulty & Complexity (20%)
    # Component 4: Category importance (10%)
    raw_score = (
        (pressure_ratio * 45.0) +
        (proximity_factor * 25.0) +
        ((difficulty / 5.0) * 15.0) +
        ((cat_weight / 1.5) * 15.0)
    ) * (diff_factor * 0.85)

    # Normalization into 1 to 99 range
    priority_score = max(5.0, min(99.0, raw_score))
    priority_score = round(priority_score, 1)

    # Urgency tiers & human explanations
    if priority_score >= 80:
        urgency_tier = 'Immediate Action'
        badge_color = 'immediate'
        recom = f"Start today! Block out {min(est_hours, 3.0):.1f} hours. Tackle the most challenging section first while your mind is fresh."
    elif priority_score >= 60:
        urgency_tier = 'High Urgency'
        badge_color = 'high'
        recom = f"Schedule a {min(est_hours, 2.0):.1f}h study block within the next 24 hours to prevent bottlenecking later."
    elif priority_score >= 40:
        urgency_tier = 'Moderate'
        badge_color = 'moderate'
        recom = f"Healthy timeline. Allocate a 1-hour prep or outline session this week to stay smoothly ahead."
    else:
        urgency_tier = 'Low Horizon'
        badge_color = 'low'
        recom = f"Ample time remaining. Keep on your radar; no immediate stress required."

    reasoning = (
        f"Requires {est_hours:.1f}h with {round(remaining_hours, 1)}h left ({round(pressure_ratio * 100)}% time pressure). "
        f"Difficulty {difficulty}/5 with {category} weight."
    )

    return {
        'priority_score': priority_score,
        'urgency_tier': urgency_tier,
        'badge_color': badge_color,
        'remaining_hours': round(remaining_hours, 1),
        'remaining_text': remaining_text,
        'pressure_ratio': round(pressure_ratio, 2),
        'reasoning': reasoning,
        'recommendation': recom,
        'is_overdue': False
    }

def rank_and_enrich_tasks(tasks, current_time=None):
    """Enriches a list of task dicts with heuristic prioritization data and sorts by urgency descending."""
    enriched = []
    for t in tasks:
        p_info = calculate_priority(t, current_time)
        t_copy = dict(t)
        t_copy.update(p_info)
        enriched.append(t_copy)

    # Sort: Incomplete tasks first sorted by priority_score desc, completed tasks at the end
    def sort_key(task):
        is_comp = 1 if task.get('status') == 'Completed' else 0
        return (is_comp, -task.get('priority_score', 0))

    enriched.sort(key=sort_key)
    return enriched
