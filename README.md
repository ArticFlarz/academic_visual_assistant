# Personalized Academic Learning and Visual Programming Assistance System

> An integrated web-based platform addressing undergraduate engineering student cognitive overload and novice programming syntax barriers.

---

## 🌟 Executive Overview

Undergraduate computer science engineering students consistently face two major academic friction points:
1. **Academic Cognitive Overload:** Fragmented task scheduling tools (e.g. Google Calendar, Todoist) treat a 15-minute quiz and a 10-hour systems programming lab due on the same day as identical, failing to account for time pressure, difficulty, or required cognitive effort.
2. **Novice Syntax Barrier:** Beginners with sound logical reasoning get stuck on strict syntax, semicolons, nested indentation, and compiler errors, obscuring fundamental algorithmic comprehension.

This platform bridges both challenges in a single, human-centered, full-stack web application:
- **Intelligent Workload Engine:** Uses an explainable heuristic algorithm considering deadlines, estimated hours, difficulty levels (1–5), and academic task weighting (Exams, Projects, Labs, Assignments, Quizzes) to generate dynamic priority scores and human study advice.
- **Visual Programming Assistant:** Drag-and-drop visual block canvas (variables, loops, conditionals, I/O) that transpiles in real time to **Structured Pseudocode**, **Python 3**, **ANSI C**, and **Java 17+**, complete with an interactive live sandbox runner.
- **75+ Algorithms Logic Library:** Dedicated educational repository with 75 structured algorithms across 8 categories, enabling candidates to search, preview, and load AST logic directly into the Visual Assistant.
- **Cognitive Analytics Dashboard:** Powered by Chart.js with warm aesthetic color grading, presenting a 7-day cognitive load forecast vs. a 4.5h daily sustainable study ceiling, category distributions, and a live stress index meter.
- **Faculty / Administrative Hub:** Separate manual login allowing instructors to monitor cohort cognitive overload, enroll new candidates, remove candidates, and broadcast course tasks to all student queues.

---

## 🎨 Warm & Humanist Visual Design

Crafted with cozy, encouraging color grading to combat student burnout:
- **Palette:** Terracotta (`#D96B43`), Golden Honey/Amber (`#E08E45`), Calming Sage Green (`#588157`), and Warm Espresso text (`#2B231E`) over warm cream ivory surfaces (`#FAF6F0`, `#FFFDF9`).
- **Smooth Spring Animations:** Micro-interactions on buttons (shimmer reflection, spring scale `:active`), glowing focus bloom on inputs, animated checkmark pop on checkboxes, and card lifts.
- **Human-Centric Copy:** Gentle study coaching ("Schedule a 2-hour sprint today", "Healthy balance — an ideal window to explore visual algorithms").
- **Stress-Aware UI:** Real-time cognitive load dial calculating student pressure and recommending actionable study pacing.

---

## 📐 System Architecture & Module Design

```
academic_visual_assistant/
│
├── app.py                     # Flask web framework entry point, routing & APIs
├── config.py                  # Environment & database configuration
├── database.py                # SQLite schema definition, ACID transactions & seed data
├── models.py                  # User, Task, and SavedProgram data access layers (SQL-injection safe)
├── prioritization.py          # Heuristic dynamic prioritization engine with explainability
├── transpiler.py              # Server-side AST transpiler (Pseudocode, Python 3, ANSI C, Java 17+)
├── run.py                     # Convenience launcher script
├── test_suite.py              # Automated test suite (Prioritization, 4-Way Transpilation, APIs)
├── requirements.txt           # Python package requirements
│
├── static/
│   ├── css/
│   │   ├── style.css          # Global warm design system, spring buttons, focus bloom, toasts
│   │   ├── dashboard.css      # Workload cards, cognitive stress dial, metrics layout
│   │   └── visual_canvas.css  # Drag-and-drop block canvas, drop indicators, 4-tab viewer & terminal
│   ├── js/
│   │   ├── app.js             # Toast alerts, modals, UI helpers
│   │   ├── tasks.js           # Task CRUD, dynamic priority badge rendering, filters
│   │   ├── analytics.js       # Chart.js visual charts & cognitive load calculations
│   │   ├── visual_canvas.js   # Drag-and-drop AST block canvas, ?load=<id> handler, Java export
│   │   ├── transpiler.js      # Client-side 4-way code transpilation (Pseudocode, Python, C, Java)
│   │   ├── program_library_data.js # 75 Curated algorithm programs with complete AST blocks
│   │   └── templates.js       # Visual Assistant quick templates
│   └── img/
│       └── logo.svg           # Custom warm academic emblem SVG
│
└── templates/
    ├── base.html              # Base layout with warm navigation & Logic Library link
    ├── login.html             # Student sign-in
    ├── admin_login.html       # Separate Faculty / Admin sign-in (manual entry)
    ├── register.html          # Student registration with semester selection
    ├── dashboard.html         # Unified Workload Management & Analytics Dashboard
    ├── program_library.html   # 75+ Algorithm Logic Library with search, filter & preview modal
    ├── visual_coder.html      # Visual Programming Assistant workspace & 4-way transpiler
    └── admin_dashboard.html   # Faculty Oversight: Enroll/Remove Candidates & Cohort Monitor
```

---

## 🧮 Heuristic Prioritization Formula

To prioritize coursework intelligently based on time pressure, complexity, and academic weighting:

$$\text{Pressure Ratio } R = \frac{\text{Estimated Hours}}{\max(0.2, \text{Hours Remaining})}$$

$$\text{Difficulty Multiplier } M_{\text{diff}} = 1.0 + 0.14 \times (\text{Difficulty} - 1)$$

$$\text{Proximity Factor } F_{\text{prox}} = \frac{48}{\text{Hours Remaining} + 16}$$

$$\text{Composite Score } = \left(45 R + 25 F_{\text{prox}} + 15\frac{D}{5} + 15\frac{W_{\text{cat}}}{1.5}\right) \times (0.85 M_{\text{diff}})$$

- **Category Weights ($W_{\text{cat}}$):** Examination (1.50) &bull; Project (1.35) &bull; Laboratory Work (1.25) &bull; Assignment (1.10) &bull; Quiz (1.00)
- **Urgency Tiers:**
  - $\ge 80$: **Immediate Action** (Critical focus required today)
  - $60 - 79$: **High Urgency** (Schedule within 24 hours)
  - $40 - 59$: **Moderate** (Healthy timeline, outline session recommended)
  - $< 40$: **Low Horizon** (Safe buffer)
  - Expired: **Critical / Overdue**

---

## 🚀 Quickstart Guide

### 1. Requirements
- Python 3.10+ (Tested on Python 3.14)
- Web browser (Chrome, Edge, Firefox, Safari)

### 2. Installation
Open a terminal in this directory:
```bash
pip install -r requirements.txt
```

### 3. Launch the Application
```bash
python run.py
```
Or alternatively:
```bash
python app.py
```

### 4. Access the Platform
Navigate to:
```
http://127.0.0.1:5000
```

### 5. Access Credentials

#### 🛡️ Faculty / Administrator (Separate Admin Sign-In)
- **URL:** `http://127.0.0.1:5000/admin/login` (or click "Faculty & Admin Portal" on the login page)
- **Username / Email:** `admin` or `admin@example.edu`
- **Password:** `admin123` (Manual entry required, no autofill)
- **Administrative Privileges:**
  - **Candidate Management:** Add new candidates ("+ Enroll Candidate") and remove candidates ("🗑️ Remove") with cascade cleanup.
  - **Cohort Oversight:** Monitor student workload and cognitive stress distributions.
  - **Coursework Broadcast:** Broadcast new assignments/labs to all candidates.
  - **Student Inspector:** Inspect student task queues and saved visual programs.

#### 👤 Student Account (Student ABC)
- **URL:** `http://127.0.0.1:5000/login`
- **Email:** `student@example.edu`
- **Password:** `student123`
- *(Quick one-click demo fill available on the student login screen)*
