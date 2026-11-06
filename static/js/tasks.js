/**
 * Academic Workload & Task Prioritization Manager
 * Handles Task CRUD, Heuristic Rank Display, Explanations, Systematic Hub Tabs and 3-Tier Tasktabs.
 */

class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentStatusFilter = 'all';
        this.currentCategoryFilter = 'all';
        this.searchQuery = '';
        this.sortBy = 'priority';

        this.tasksListContainer = document.getElementById('tasksListContainer');
        this.modalAddTask = document.getElementById('modalAddTask');
        this.formAddTask = document.getElementById('formAddTask');
        this.btnOpenAddTask = document.getElementById('btnOpenAddTask');
        this.btnHubOpenAddTask = document.getElementById('btnHubOpenAddTask');
        this.btnCloseModal = document.getElementById('btnCloseModal');
        this.btnCancelModal = document.getElementById('btnCancelModal');

        this.searchInput = document.getElementById('taskSearchInput');
        this.btnClearSearch = document.getElementById('btnClearSearch');
        this.taskSortSelect = document.getElementById('taskSortSelect');
        this.btnResetFilters = document.getElementById('btnResetFilters');
        this.taskResultsCount = document.getElementById('taskResultsCount');

        this.init();
    }

    init() {
        if (!this.tasksListContainer) return;

        this.setupHubTabs();
        this.setupEventListeners();
        this.loadTasks();
    }

    setupHubTabs() {
        const hubTabs = document.querySelectorAll('.hub-tab-btn');
        const container = document.getElementById('dashboardMainContainer');
        if (!container || hubTabs.length === 0) return;

        const savedTab = localStorage.getItem('academic_active_hub_tab') || 'tasks';
        this.switchHubTab(savedTab);

        hubTabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.hubTab;
                this.switchHubTab(tab);
            });
        });
    }

    switchHubTab(tabName) {
        const container = document.getElementById('dashboardMainContainer');
        if (!container) return;

        container.dataset.activeView = tabName;
        localStorage.setItem('academic_active_hub_tab', tabName);

        document.querySelectorAll('.hub-tab-btn').forEach(btn => {
            const isActive = (btn.dataset.hubTab === tabName);
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Trigger chart resize if switching to analytics or unified
        if (tabName === 'analytics' || tabName === 'unified') {
            setTimeout(() => {
                if (window.analyticsManager && typeof window.analyticsManager.resizeCharts === 'function') {
                    window.analyticsManager.resizeCharts();
                }
            }, 60);
        }
    }

    setupEventListeners() {
        // Tier 1: Status tasktabs
        document.querySelectorAll('.tasktab-btn, .status-pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tasktab-btn, .status-pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentStatusFilter = btn.dataset.status;
                this.render();
            });
        });

        // Tier 2: Category chips
        document.querySelectorAll('.category-chip-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-chip-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategoryFilter = btn.dataset.category;
                this.render();
            });
        });

        // Legacy category dropdown support (if present)
        const categoryFilter = document.getElementById('categoryFilterSelect');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentCategoryFilter = e.target.value;
                document.querySelectorAll('.category-chip-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.category === this.currentCategoryFilter);
                });
                this.render();
            });
        }

        // Tier 3: Search input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                if (this.btnClearSearch) {
                    this.btnClearSearch.style.display = this.searchQuery ? 'inline-flex' : 'none';
                }
                this.render();
            });
        }

        // Search clear button
        if (this.btnClearSearch) {
            this.btnClearSearch.addEventListener('click', () => {
                if (this.searchInput) {
                    this.searchInput.value = '';
                    this.searchInput.focus();
                }
                this.searchQuery = '';
                this.btnClearSearch.style.display = 'none';
                this.render();
            });
        }

        // Sort selector
        if (this.taskSortSelect) {
            this.taskSortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.render();
            });
        }

        // Reset Filters Button
        if (this.btnResetFilters) {
            this.btnResetFilters.addEventListener('click', () => {
                this.currentStatusFilter = 'all';
                this.currentCategoryFilter = 'all';
                this.searchQuery = '';
                this.sortBy = 'priority';

                if (this.searchInput) this.searchInput.value = '';
                if (this.btnClearSearch) this.btnClearSearch.style.display = 'none';
                if (this.taskSortSelect) this.taskSortSelect.value = 'priority';

                document.querySelectorAll('.tasktab-btn, .status-pill-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.status === 'all');
                });
                document.querySelectorAll('.category-chip-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.category === 'all');
                });

                this.render();
            });
        }

        // Modal triggers
        if (this.btnOpenAddTask) {
            this.btnOpenAddTask.addEventListener('click', () => this.openModal());
        }
        if (this.btnHubOpenAddTask) {
            this.btnHubOpenAddTask.addEventListener('click', () => this.openModal());
        }
        if (this.btnCloseModal) {
            this.btnCloseModal.addEventListener('click', () => this.closeModal());
        }
        if (this.btnCancelModal) {
            this.btnCancelModal.addEventListener('click', () => this.closeModal());
        }

        // Form submit
        if (this.formAddTask) {
            this.formAddTask.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
    }

    async loadTasks() {
        try {
            const res = await fetch('/api/tasks');
            const data = await res.json();
            if (data.success) {
                this.tasks = data.tasks;
                this.render();
                if (window.analyticsManager) {
                    window.analyticsManager.loadAnalytics();
                }
                if (window.calendarManager) {
                    window.calendarManager.updateTasks(this.tasks);
                }
            }
        } catch (err) {
            console.error("Failed to load academic tasks:", err);
            this.tasksListContainer.innerHTML = `<div class="empty-state"><p>Could not connect to workload database.</p></div>`;
        }
    }

    getFilteredTasks() {
        let list = this.tasks.filter(task => {
            // Status match
            if (this.currentStatusFilter !== 'all') {
                if (this.currentStatusFilter === 'active') {
                    if (task.status === 'Completed') return false;
                } else if (this.currentStatusFilter === 'urgent') {
                    const isOverdue = task.is_overdue || (task.deadline && new Date(task.deadline.replace(' ', 'T')).getTime() < Date.now());
                    const isHighPriority = task.priority_score && task.priority_score >= 80;
                    if (!isOverdue && !isHighPriority && task.urgency_tier !== 'Immediate Action') return false;
                    if (task.status === 'Completed') return false;
                } else {
                    if (task.status !== this.currentStatusFilter) return false;
                }
            }

            // Category match
            if (this.currentCategoryFilter !== 'all' && task.category !== this.currentCategoryFilter) {
                return false;
            }

            // Search query match
            if (this.searchQuery) {
                const q = this.searchQuery.toLowerCase().trim();
                const matchTitle = (task.title || '').toLowerCase().includes(q);
                const matchCourse = (task.course_code || '').toLowerCase().includes(q);
                const matchDesc = (task.description || '').toLowerCase().includes(q);
                const matchCat = (task.category || '').toLowerCase().includes(q);
                if (!matchTitle && !matchCourse && !matchDesc && !matchCat) return false;
            }

            return true;
        });

        // Sorting
        list.sort((a, b) => {
            if (this.sortBy === 'deadline') {
                const dateA = a.deadline ? new Date(a.deadline.replace(' ', 'T')).getTime() : Infinity;
                const dateB = b.deadline ? new Date(b.deadline.replace(' ', 'T')).getTime() : Infinity;
                return dateA - dateB;
            } else if (this.sortBy === 'effort_asc') {
                return (parseFloat(a.estimated_hours) || 0) - (parseFloat(b.estimated_hours) || 0);
            } else if (this.sortBy === 'effort_desc') {
                return (parseFloat(b.estimated_hours) || 0) - (parseFloat(a.estimated_hours) || 0);
            } else if (this.sortBy === 'difficulty') {
                return (b.perceived_difficulty || 0) - (a.perceived_difficulty || 0);
            } else {
                // Default: priority score descending
                return (b.priority_score || 0) - (a.priority_score || 0);
            }
        });

        return list;
    }

    updateCounts() {
        const total = this.tasks.length;
        const active = this.tasks.filter(t => t.status !== 'Completed').length;
        const urgent = this.tasks.filter(t => {
            if (t.status === 'Completed') return false;
            const isOverdue = t.is_overdue || (t.deadline && new Date(t.deadline.replace(' ', 'T')).getTime() < Date.now());
            return isOverdue || (t.priority_score && t.priority_score >= 80) || t.urgency_tier === 'Immediate Action';
        }).length;
        const inProgress = this.tasks.filter(t => t.status === 'In Progress').length;
        const pending = this.tasks.filter(t => t.status === 'Pending').length;
        const completed = this.tasks.filter(t => t.status === 'Completed').length;

        const setTxt = (id, txt) => {
            const el = document.getElementById(id);
            if (el) el.textContent = txt;
        };

        setTxt('badgeCountAll', total);
        setTxt('badgeCountActive', active);
        setTxt('badgeCountUrgent', urgent);
        setTxt('badgeCountInProgress', inProgress);
        setTxt('badgeCountPending', pending);
        setTxt('badgeCountCompleted', completed);

        // Category counts
        const countCat = (cat) => this.tasks.filter(t => t.category === cat).length;
        setTxt('catCountAll', total);
        setTxt('catCountLab', countCat('Laboratory Work'));
        setTxt('catCountAssign', countCat('Assignment'));
        setTxt('catCountProj', countCat('Project'));
        setTxt('catCountExam', countCat('Examination'));
        setTxt('catCountQuiz', countCat('Reading/Quiz'));

        // Hub tabs badges
        setTxt('hubTabBadgeTasks', `${active} Active`);
        setTxt('hubTabBadgeCalendar', `${urgent > 0 ? urgent + ' Urgent' : total + ' Dues'}`);

        // Update results counter
        const filtered = this.getFilteredTasks();
        const resultsEl = document.getElementById('taskResultsCount');
        if (resultsEl) {
            resultsEl.textContent = `Showing ${filtered.length} of ${total} tasks`;
        }

        // Toggle reset filters button visibility
        const resetBtn = document.getElementById('btnResetFilters');
        if (resetBtn) {
            const isFiltered = this.currentStatusFilter !== 'all' || this.currentCategoryFilter !== 'all' || this.searchQuery || this.sortBy !== 'priority';
            resetBtn.style.display = isFiltered ? 'inline-flex' : 'none';
        }
    }

    render() {
        const filtered = this.getFilteredTasks();
        this.updateCounts();

        if (filtered.length === 0) {
            this.tasksListContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <h4>No coursework matches criteria</h4>
                    <p>There are no items matching your current filters. Try resetting the filters or logging a new task.</p>
                </div>
            `;
            return;
        }

        this.tasksListContainer.innerHTML = '';
        filtered.forEach(task => {
            const card = this.createTaskCard(task);
            this.tasksListContainer.appendChild(card);
        });
    }

    createTaskCard(task) {
        const div = document.createElement('div');
        const isCompleted = task.status === 'Completed';

        let priorityClass = 'priority-low';
        if (task.is_overdue) priorityClass = 'priority-critical';
        else if (task.priority_score >= 80) priorityClass = 'priority-immediate';
        else if (task.priority_score >= 60) priorityClass = 'priority-high';
        else if (task.priority_score >= 40) priorityClass = 'priority-moderate';

        div.className = `task-card ${priorityClass} ${isCompleted ? 'task-completed' : ''}`;
        div.dataset.taskId = task.id;

        const badgeType = task.badge_color || 'low';

        div.innerHTML = `
            <div class="task-top-bar">
                <div class="task-meta-left">
                    ${task.course_code ? `<span class="course-code-badge">${escapeHtml(task.course_code)}</span>` : ''}
                    <span class="category-tag">${escapeHtml(task.category)}</span>
                    <span class="urgency-badge badge-${badgeType}">
                        ⚡ Priority ${task.priority_score} • ${escapeHtml(task.urgency_tier)}
                    </span>
                </div>
                <div class="stat-inline-item" style="font-weight:600; font-size:0.8rem; color:${task.is_overdue ? 'var(--accent-crimson)' : 'var(--text-secondary)'}">
                    ⏰ ${escapeHtml(task.remaining_text)}
                </div>
            </div>

            <div class="task-main-content">
                <div class="task-title-row">
                    <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked' : ''} title="Mark task as complete" />
                    <span class="task-title">${escapeHtml(task.title)}</span>
                </div>
                ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
                
                ${!isCompleted ? `
                    <div class="heuristic-explain-box">
                        <div class="explain-row">
                            <span>🔍 <strong>Why this rank:</strong> ${escapeHtml(task.reasoning)}</span>
                        </div>
                        <div class="recom-row">
                            <span>💡 <strong>Study Advice:</strong> ${escapeHtml(task.recommendation)}</span>
                        </div>
                    </div>
                ` : ''}
            </div>

            <div class="task-footer-bar">
                <div class="task-stats-inline">
                    <div class="stat-inline-item">
                        <span>⏳ Est. Effort:</span> <strong>${task.estimated_hours} hrs</strong>
                    </div>
                    <div class="stat-inline-item">
                        <span>📊 Difficulty:</span> <strong>${this.renderDifficultyStars(task.perceived_difficulty)}</strong>
                    </div>
                    <div class="stat-inline-item">
                        <span>📌 Status:</span> <strong style="color:var(--primary);">${task.status}</strong>
                    </div>
                </div>

                <div class="task-actions-row">
                    <a href="/visual-assistant" class="btn btn-secondary btn-sm" title="Open in Visual Assistant">
                        🧩 Code Visual
                    </a>
                    <button class="btn btn-secondary btn-sm btn-delete-task" title="Delete Task" style="color:var(--accent-crimson);">
                        🗑️
                    </button>
                </div>
            </div>
        `;

        // Checkbox status toggle
        const checkbox = div.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => this.toggleTaskStatus(task.id));

        // Delete button
        const btnDelete = div.querySelector('.btn-delete-task');
        btnDelete.addEventListener('click', () => this.deleteTask(task.id));

        return div;
    }

    renderDifficultyStars(diff) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += (i <= diff) ? '★' : '☆';
        }
        return `${diff}/5 ${stars}`;
    }

    async toggleTaskStatus(taskId) {
        try {
            const res = await fetch(`/api/tasks/${taskId}/toggle-status`, { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                window.showAppToast?.(`Task status updated to ${data.new_status}`, 'success');
                this.loadTasks();
            }
        } catch (err) {
            window.showAppToast?.("Failed to update status", 'danger');
        }
    }

    async deleteTask(taskId) {
        if (!confirm("Are you sure you want to remove this academic task?")) return;
        try {
            const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                window.showAppToast?.(data.message, 'info');
                this.loadTasks();
            }
        } catch (err) {
            window.showAppToast?.("Could not remove task", 'danger');
        }
    }

    openModal() {
        if (!this.modalAddTask) return;
        this.formAddTask.reset();

        // Pre-fill tomorrow afternoon as default deadline
        const deadlineInput = document.getElementById('taskDeadline');
        if (deadlineInput) {
            const d = new Date();
            d.setDate(d.getDate() + 2);
            d.setHours(18, 0, 0, 0);
            deadlineInput.value = d.toISOString().slice(0, 16);
        }

        this.modalAddTask.classList.add('active');
    }

    closeModal() {
        if (this.modalAddTask) {
            this.modalAddTask.classList.remove('active');
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const title = document.getElementById('taskTitle').value.trim();
        const course_code = document.getElementById('taskCourseCode').value.trim();
        const category = document.getElementById('taskCategory').value;
        const deadline = document.getElementById('taskDeadline').value;
        const estimated_hours = parseFloat(document.getElementById('taskEstimatedHours').value) || 2.0;
        const perceived_difficulty = parseInt(document.getElementById('taskDifficulty').value) || 3;
        const description = document.getElementById('taskDescription').value.trim();

        if (!title || !deadline) {
            window.showAppToast?.("Please provide a title and deadline.", 'warning');
            return;
        }

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    course_code,
                    category,
                    deadline,
                    estimated_hours,
                    perceived_difficulty,
                    description,
                    status: 'Pending'
                })
            });

            const data = await res.json();
            if (data.success) {
                window.showAppToast?.(data.message, 'success');
                this.closeModal();
                this.loadTasks();
            } else {
                window.showAppToast?.(data.error || "Failed to create task", 'danger');
            }
        } catch (err) {
            window.showAppToast?.("Error submitting task.", 'danger');
        }
    }
}

window.TaskManager = TaskManager;

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});
