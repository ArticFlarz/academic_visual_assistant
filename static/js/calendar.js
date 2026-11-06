/**
 * Academic Workload Calendar & Due Reminder Manager
 * Provides a real interactive monthly calendar, due/to-do tracking, and personal study reminders.
 */

(function () {
    const MONTH_NAMES = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    class CalendarManager {
        constructor() {
            this.currentDate = new Date();
            this.viewYear = this.currentDate.getFullYear();
            this.viewMonth = this.currentDate.getMonth();
            this.selectedDateStr = this.formatDateKey(this.currentDate);
            this.tasks = [];
            this.reminders = this.loadReminders();

            this.initDOMElements();
            this.bindEvents();
            this.render();
        }

        initDOMElements() {
            this.monthYearLabel = document.getElementById('calMonthYearLabel');
            this.btnPrev = document.getElementById('calBtnPrev');
            this.btnNext = document.getElementById('calBtnNext');
            this.btnToday = document.getElementById('calBtnToday');
            this.daysGrid = document.getElementById('calDaysGrid');
            this.reminderBanner = document.getElementById('calReminderBanner');
            this.dayDetailTitle = document.getElementById('calDayDetailTitle');
            this.dayDuesSummary = document.getElementById('calDayDuesSummary');
            this.dayDuesList = document.getElementById('calDayDuesList');
            this.dayRemindersList = document.getElementById('calDayRemindersList');
            this.newReminderInput = document.getElementById('calNewReminderInput');
            this.btnAddReminder = document.getElementById('calBtnAddReminder');
            this.btnQuickAddTask = document.getElementById('calBtnQuickAddTask');
        }

        bindEvents() {
            if (this.btnPrev) {
                this.btnPrev.addEventListener('click', () => this.navigateMonth(-1));
            }
            if (this.btnNext) {
                this.btnNext.addEventListener('click', () => this.navigateMonth(1));
            }
            if (this.btnToday) {
                this.btnToday.addEventListener('click', () => this.goToToday());
            }

            // Quick Add reminder on button click or Enter key
            if (this.btnAddReminder && this.newReminderInput) {
                this.btnAddReminder.addEventListener('click', () => this.handleAddReminder());
                this.newReminderInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleAddReminder();
                    }
                });
            }

            // Log Task for this Day shortcut
            if (this.btnQuickAddTask) {
                this.btnQuickAddTask.addEventListener('click', () => this.openAddTaskForSelectedDate());
            }
        }

        formatDateKey(date) {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        }

        parseDateKey(dateStr) {
            const parts = dateStr.split('-');
            return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        }

        getTaskDateKey(task) {
            if (!task || !task.deadline) return null;
            const match = task.deadline.match(/^(\d{4}-\d{2}-\d{2})/);
            return match ? match[1] : null;
        }

        loadReminders() {
            try {
                const raw = localStorage.getItem('academic_study_reminders_v1');
                return raw ? JSON.parse(raw) : {};
            } catch (e) {
                console.warn('Could not parse reminders from localStorage:', e);
                return {};
            }
        }

        saveReminders() {
            try {
                localStorage.setItem('academic_study_reminders_v1', JSON.stringify(this.reminders));
            } catch (e) {
                console.warn('Could not save reminders to localStorage:', e);
            }
        }

        getRemindersForDate(dateStr) {
            return this.reminders[dateStr] || [];
        }

        handleAddReminder() {
            if (!this.newReminderInput) return;
            const text = this.newReminderInput.value.trim();
            if (!text) {
                this.newReminderInput.focus();
                return;
            }

            if (!this.reminders[this.selectedDateStr]) {
                this.reminders[this.selectedDateStr] = [];
            }

            const newReminder = {
                id: 'rem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };

            this.reminders[this.selectedDateStr].push(newReminder);
            this.saveReminders();
            this.newReminderInput.value = '';

            window.showAppToast?.('Study reminder saved!', 'success');
            this.renderGrid();
            this.renderDayDetail();
            this.renderReminderBanner();
        }

        toggleReminder(dateStr, reminderId) {
            const list = this.reminders[dateStr];
            if (!list) return;
            const item = list.find(r => r.id === reminderId);
            if (item) {
                item.completed = !item.completed;
                this.saveReminders();
                this.renderGrid();
                this.renderDayDetail();
                this.renderReminderBanner();
            }
        }

        deleteReminder(dateStr, reminderId) {
            const list = this.reminders[dateStr];
            if (!list) return;
            this.reminders[dateStr] = list.filter(r => r.id !== reminderId);
            if (this.reminders[dateStr].length === 0) {
                delete this.reminders[dateStr];
            }
            this.saveReminders();
            window.showAppToast?.('Reminder removed', 'info');
            this.renderGrid();
            this.renderDayDetail();
            this.renderReminderBanner();
        }

        updateTasks(tasks) {
            this.tasks = tasks || [];
            this.render();
        }

        navigateMonth(delta) {
            this.viewMonth += delta;
            if (this.viewMonth < 0) {
                this.viewMonth = 11;
                this.viewYear -= 1;
            } else if (this.viewMonth > 11) {
                this.viewMonth = 0;
                this.viewYear += 1;
            }
            this.render();
        }

        goToToday() {
            this.currentDate = new Date();
            this.viewYear = this.currentDate.getFullYear();
            this.viewMonth = this.currentDate.getMonth();
            this.selectedDateStr = this.formatDateKey(this.currentDate);
            this.render();
        }

        selectDate(dateStr) {
            this.selectedDateStr = dateStr;
            this.renderGrid();
            this.renderDayDetail();
        }

        getTasksForDate(dateStr) {
            return this.tasks.filter(task => this.getTaskDateKey(task) === dateStr);
        }

        openAddTaskForSelectedDate() {
            if (window.taskManager) {
                window.taskManager.openModal();
                const deadlineInput = document.getElementById('taskDeadline');
                if (deadlineInput && this.selectedDateStr) {
                    deadlineInput.value = `${this.selectedDateStr}T17:00`;
                }
            }
        }

        async toggleTaskFromCalendar(taskId) {
            if (window.taskManager && typeof window.taskManager.toggleTaskStatus === 'function') {
                await window.taskManager.toggleTaskStatus(taskId);
            } else {
                try {
                    const res = await fetch(`/api/tasks/${taskId}/toggle-status`, { method: 'POST' });
                    const data = await res.json();
                    if (data.success) {
                        window.showAppToast?.(`Task status updated to ${data.new_status}`, 'success');
                        if (window.taskManager) window.taskManager.loadTasks();
                    }
                } catch (e) {
                    window.showAppToast?.('Failed to update task status', 'danger');
                }
            }
        }

        render() {
            if (this.monthYearLabel) {
                this.monthYearLabel.textContent = `${MONTH_NAMES[this.viewMonth]} ${this.viewYear}`;
            }
            this.renderReminderBanner();
            this.renderGrid();
            this.renderDayDetail();
        }

        renderReminderBanner() {
            if (!this.reminderBanner) return;

            const now = new Date();
            const todayKey = this.formatDateKey(now);
            const activeTasks = this.tasks.filter(t => t.status !== 'Completed');
            const todayReminders = (this.reminders[todayKey] || []).filter(r => !r.completed);

            if (activeTasks.length === 0 && todayReminders.length === 0) {
                this.reminderBanner.innerHTML = `
                    <div class="cal-banner-box banner-all-clear">
                        <span class="cal-banner-icon">🎉</span>
                        <div class="cal-banner-text">
                            <strong>All Caught Up!</strong>
                            <span>You have zero pending academic coursework deadlines. Great work!</span>
                        </div>
                    </div>
                `;
                return;
            }

            // Identify overdue and upcoming tasks
            let earliestUpcoming = null;
            let earliestUpcomingDiff = Infinity;
            const overdueTasks = [];

            activeTasks.forEach(task => {
                if (!task.deadline) return;
                const deadlineDate = new Date(task.deadline.replace(' ', 'T'));
                const diffMs = deadlineDate.getTime() - now.getTime();
                if (diffMs < 0) {
                    overdueTasks.push({ task, diffMs, deadlineDate });
                } else {
                    if (diffMs < earliestUpcomingDiff) {
                        earliestUpcomingDiff = diffMs;
                        earliestUpcoming = { task, diffMs, deadlineDate };
                    }
                }
            });

            if (overdueTasks.length > 0) {
                overdueTasks.sort((a, b) => a.diffMs - b.diffMs);
                const primaryOverdue = overdueTasks[0];
                const hoursOverdue = Math.abs(Math.round(primaryOverdue.diffMs / (1000 * 60 * 60)));
                const timeString = hoursOverdue < 24 ? `${hoursOverdue}h ago` : `${Math.floor(hoursOverdue / 24)}d ago`;

                this.reminderBanner.innerHTML = `
                    <div class="cal-banner-box banner-urgent">
                        <span class="cal-banner-icon">🚨</span>
                        <div class="cal-banner-text">
                            <div class="cal-banner-headline">
                                <strong>Overdue Alert (${overdueTasks.length} task${overdueTasks.length > 1 ? 's' : ''}):</strong>
                                <span class="cal-time-pill overdue">${timeString}</span>
                            </div>
                            <div class="cal-banner-sub">
                                <span class="cal-course-tag">${escapeHtml(primaryOverdue.task.course_code || 'ACAD')}</span>
                                <span class="cal-banner-title">${escapeHtml(primaryOverdue.task.title)}</span>
                                ${todayReminders.length > 0 ? `<span class="cal-banner-rem-tag">📝 ${todayReminders.length} study note${todayReminders.length > 1 ? 's' : ''} today</span>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            } else if (earliestUpcoming) {
                const hoursLeft = Math.round(earliestUpcoming.diffMs / (1000 * 60 * 60));
                let timeString = '';
                if (hoursLeft <= 1) {
                    timeString = 'Due within the hour!';
                } else if (hoursLeft < 24) {
                    timeString = `Due in ${hoursLeft} hours`;
                } else {
                    const days = Math.floor(hoursLeft / 24);
                    const remH = hoursLeft % 24;
                    timeString = `Due in ${days}d ${remH}h`;
                }

                this.reminderBanner.innerHTML = `
                    <div class="cal-banner-box banner-next-due">
                        <span class="cal-banner-icon">⏰</span>
                        <div class="cal-banner-text">
                            <div class="cal-banner-headline">
                                <strong>Next Due Reminder:</strong>
                                <span class="cal-time-pill upcoming">${timeString}</span>
                            </div>
                            <div class="cal-banner-sub">
                                <span class="cal-course-tag">${escapeHtml(earliestUpcoming.task.course_code || 'ACAD')}</span>
                                <span class="cal-banner-title">${escapeHtml(earliestUpcoming.task.title)}</span>
                                ${todayReminders.length > 0 ? `<span class="cal-banner-rem-tag">📝 ${todayReminders.length} study note${todayReminders.length > 1 ? 's' : ''} today</span>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            } else if (todayReminders.length > 0) {
                this.reminderBanner.innerHTML = `
                    <div class="cal-banner-box banner-study-notes">
                        <span class="cal-banner-icon">📝</span>
                        <div class="cal-banner-text">
                            <div class="cal-banner-headline">
                                <strong>Today's Study Reminders:</strong>
                                <span class="cal-time-pill notes">${todayReminders.length} active</span>
                            </div>
                            <div class="cal-banner-sub">
                                <span class="cal-banner-title">${escapeHtml(todayReminders[0].text)}</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        renderGrid() {
            if (!this.daysGrid) return;

            this.daysGrid.innerHTML = '';

            const todayKey = this.formatDateKey(new Date());
            const firstDayIndex = new Date(this.viewYear, this.viewMonth, 1).getDay();
            const daysInMonth = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
            const daysInPrevMonth = new Date(this.viewYear, this.viewMonth, 0).getDate();

            // 1. Preceding month's trailing days
            for (let i = firstDayIndex - 1; i >= 0; i--) {
                const dayNum = daysInPrevMonth - i;
                const prevMonth = this.viewMonth === 0 ? 11 : this.viewMonth - 1;
                const prevYear = this.viewMonth === 0 ? this.viewYear - 1 : this.viewYear;
                const dateKey = this.formatDateKey(new Date(prevYear, prevMonth, dayNum));
                const cell = this.createDayCell(dayNum, dateKey, true);
                this.daysGrid.appendChild(cell);
            }

            // 2. Current month days
            for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
                const dateKey = this.formatDateKey(new Date(this.viewYear, this.viewMonth, dayNum));
                const isToday = (dateKey === todayKey);
                const isSelected = (dateKey === this.selectedDateStr);
                const cell = this.createDayCell(dayNum, dateKey, false, isToday, isSelected);
                this.daysGrid.appendChild(cell);
            }

            // 3. Following month's leading days (pad to end of week, or complete 35/42 cells)
            const totalCellsSoFar = firstDayIndex + daysInMonth;
            const remainingToCompleteWeek = (7 - (totalCellsSoFar % 7)) % 7;
            const totalTargetCells = totalCellsSoFar + remainingToCompleteWeek <= 35 ? 35 : 42;
            const cellsToFill = totalTargetCells - totalCellsSoFar;

            for (let i = 1; i <= cellsToFill; i++) {
                const nextMonth = this.viewMonth === 11 ? 0 : this.viewMonth + 1;
                const nextYear = this.viewMonth === 11 ? this.viewYear + 1 : this.viewYear;
                const dateKey = this.formatDateKey(new Date(nextYear, nextMonth, i));
                const cell = this.createDayCell(i, dateKey, true);
                this.daysGrid.appendChild(cell);
            }
        }

        createDayCell(dayNum, dateKey, isOtherMonth, isToday = false, isSelected = false) {
            const cell = document.createElement('div');
            cell.className = 'cal-day-cell';
            if (isOtherMonth) cell.classList.add('day-other-month');
            if (isToday) cell.classList.add('day-today');
            if (isSelected) cell.classList.add('day-selected');

            cell.dataset.date = dateKey;

            // Day number label
            const numEl = document.createElement('div');
            numEl.className = 'cal-day-num';
            numEl.textContent = dayNum;
            if (isToday) {
                numEl.title = "Today";
            }
            cell.appendChild(numEl);

            // Badges & indicators container
            const indicators = document.createElement('div');
            indicators.className = 'cal-day-indicators';

            const tasksForDate = this.getTasksForDate(dateKey);
            const remindersForDate = this.getRemindersForDate(dateKey);

            if (tasksForDate.length > 0) {
                cell.classList.add('day-has-dues');
                const now = new Date();
                let hasOverdueOrUrgent = false;
                let hasActive = false;
                let allCompleted = true;

                tasksForDate.forEach(t => {
                    if (t.status !== 'Completed') {
                        allCompleted = false;
                        const dl = new Date(t.deadline.replace(' ', 'T'));
                        if (dl.getTime() < now.getTime() || (t.priority_score && t.priority_score >= 80)) {
                            hasOverdueOrUrgent = true;
                        } else {
                            hasActive = true;
                        }
                    }
                });

                const dueBadge = document.createElement('span');
                dueBadge.className = 'cal-badge-due';
                if (allCompleted) {
                    dueBadge.classList.add('due-completed');
                    dueBadge.innerHTML = `✓ ${tasksForDate.length} done`;
                } else if (hasOverdueOrUrgent) {
                    dueBadge.classList.add('due-urgent');
                    dueBadge.textContent = `${tasksForDate.length} due ⚠️`;
                } else {
                    dueBadge.classList.add('due-active');
                    dueBadge.textContent = `${tasksForDate.length} due`;
                }
                indicators.appendChild(dueBadge);
            }

            if (remindersForDate.length > 0) {
                const remBadge = document.createElement('span');
                remBadge.className = 'cal-badge-reminder';
                const uncompletedCount = remindersForDate.filter(r => !r.completed).length;
                remBadge.innerHTML = `📝 ${uncompletedCount > 0 ? uncompletedCount : '✓'}`;
                remBadge.title = `${remindersForDate.length} study reminder(s)`;
                indicators.appendChild(remBadge);
            }

            cell.appendChild(indicators);

            cell.addEventListener('click', () => {
                this.selectDate(dateKey);
            });

            return cell;
        }

        renderDayDetail() {
            if (!this.dayDetailTitle) return;

            const selectedDate = this.parseDateKey(this.selectedDateStr);
            const weekday = WEEKDAY_NAMES[selectedDate.getDay()];
            const monthName = MONTH_NAMES[selectedDate.getMonth()];
            const dayNum = selectedDate.getDate();
            const yearNum = selectedDate.getFullYear();

            const isToday = (this.selectedDateStr === this.formatDateKey(new Date()));
            this.dayDetailTitle.innerHTML = `
                <span>${weekday}, ${monthName} ${dayNum}, ${yearNum}</span>
                ${isToday ? '<span class="cal-today-tag">Today</span>' : ''}
            `;

            const tasksForDate = this.getTasksForDate(this.selectedDateStr);
            const remindersForDate = this.getRemindersForDate(this.selectedDateStr);

            if (this.dayDuesSummary) {
                this.dayDuesSummary.textContent = `${tasksForDate.length} Academic Due${tasksForDate.length === 1 ? '' : 's'} • ${remindersForDate.length} Reminder${remindersForDate.length === 1 ? '' : 's'}`;
            }

            // Render Academic Dues
            if (this.dayDuesList) {
                this.dayDuesList.innerHTML = '';
                if (tasksForDate.length === 0) {
                    this.dayDuesList.innerHTML = `
                        <div class="cal-empty-sub">
                            <span>☕ No academic coursework deadlines scheduled for this day.</span>
                        </div>
                    `;
                } else {
                    tasksForDate.forEach(task => {
                        const item = document.createElement('div');
                        item.className = 'cal-task-item';
                        if (task.status === 'Completed') item.classList.add('task-completed-item');

                        let timeString = '';
                        if (task.deadline) {
                            const timePart = task.deadline.includes('T') ? task.deadline.split('T')[1] : (task.deadline.split(' ')[1] || '');
                            timeString = timePart ? timePart.slice(0, 5) : '23:59';
                        }

                        const isCompleted = (task.status === 'Completed');

                        item.innerHTML = `
                            <div class="cal-task-left">
                                <input type="checkbox" class="task-checkbox cal-task-check" ${isCompleted ? 'checked' : ''} title="Mark as ${isCompleted ? 'Pending' : 'Completed'}">
                                <div>
                                    <div class="cal-task-title-line">
                                        <span class="cal-course-pill">${escapeHtml(task.course_code || 'ACAD')}</span>
                                        <strong class="cal-task-title ${isCompleted ? 'text-strikethrough' : ''}">${escapeHtml(task.title)}</strong>
                                    </div>
                                    <div class="cal-task-meta-line">
                                        <span class="cal-cat-badge">${escapeHtml(task.category || 'Workload')}</span>
                                        <span class="cal-task-time">⏰ Due ${timeString}</span>
                                        <span class="cal-task-status-tag ${isCompleted ? 'status-done' : (task.is_overdue ? 'status-overdue' : 'status-active')}">
                                            ${isCompleted ? 'Completed' : (task.is_overdue ? 'Overdue' : task.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="cal-task-right">
                                <a href="/visual-assistant" class="cal-btn-visual-link" title="Open Visual Studio">🧩</a>
                            </div>
                        `;

                        const check = item.querySelector('.cal-task-check');
                        if (check) {
                            check.addEventListener('change', () => this.toggleTaskFromCalendar(task.id));
                        }

                        this.dayDuesList.appendChild(item);
                    });
                }
            }

            // Render Study Reminders
            if (this.dayRemindersList) {
                this.dayRemindersList.innerHTML = '';
                if (remindersForDate.length === 0) {
                    this.dayRemindersList.innerHTML = `
                        <div class="cal-empty-sub">
                            <span>No study reminders for this date. Add one below!</span>
                        </div>
                    `;
                } else {
                    remindersForDate.forEach(rem => {
                        const item = document.createElement('div');
                        item.className = 'cal-reminder-item';
                        if (rem.completed) item.classList.add('rem-completed');

                        item.innerHTML = `
                            <div class="cal-rem-left">
                                <input type="checkbox" class="cal-rem-check" ${rem.completed ? 'checked' : ''}>
                                <span class="cal-rem-text ${rem.completed ? 'text-strikethrough' : ''}">${escapeHtml(rem.text)}</span>
                            </div>
                            <button type="button" class="cal-rem-delete-btn" title="Delete Reminder">🗑️</button>
                        `;

                        const check = item.querySelector('.cal-rem-check');
                        if (check) {
                            check.addEventListener('change', () => this.toggleReminder(this.selectedDateStr, rem.id));
                        }

                        const delBtn = item.querySelector('.cal-rem-delete-btn');
                        if (delBtn) {
                            delBtn.addEventListener('click', () => this.deleteReminder(this.selectedDateStr, rem.id));
                        }

                        this.dayRemindersList.appendChild(item);
                    });
                }
            }
        }
    }

    // Attach to global window
    window.CalendarManager = CalendarManager;

    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('calDaysGrid')) {
            window.calendarManager = new CalendarManager();
        }
    });
})();
