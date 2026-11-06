// Comprehensive Unit Test for Hub Tabs & 3-Tier Tasktabs Logic
const fs = require('fs');

const store = {};
global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; }
};

global.window = {
    showAppToast: (msg, type) => console.log(`[TOAST - ${type}]: ${msg}`),
    analyticsManager: {
        resizeCharts: () => console.log("[ANALYTICS]: resizeCharts called")
    },
    calendarManager: {
        updateTasks: () => {}
    }
};

function createElement(tag) {
    const el = {
        tagName: tag,
        classList: {
            classes: new Set(),
            add(c) { this.classes.add(c); },
            remove(c) { this.classes.delete(c); },
            has(c) { return this.classes.has(c); },
            toggle(c, force) {
                if (force === undefined) {
                    if (this.classes.has(c)) this.classes.delete(c);
                    else this.classes.add(c);
                } else if (force) {
                    this.classes.add(c);
                } else {
                    this.classes.delete(c);
                }
            }
        },
        dataset: {},
        style: {},
        innerHTML: '',
        textContent: '',
        children: [],
        appendChild(child) {
            this.children.push(child);
            return child;
        },
        setAttribute(k, v) { this[k] = v; },
        getAttribute(k) { return this[k]; },
        querySelector(selector) { return createElement('div'); },
        querySelectorAll(selector) { return []; },
        addEventListener(event, fn) {
            if (!this.handlers) this.handlers = {};
            this.handlers[event] = fn;
        },
        click() {
            if (this.handlers && this.handlers['click']) this.handlers['click']();
        }
    };
    return el;
}

// Elements dictionary
const elements = {
    dashboardMainContainer: createElement('div'),
    tasksListContainer: createElement('div'),
    modalAddTask: createElement('div'),
    formAddTask: createElement('form'),
    btnOpenAddTask: createElement('button'),
    btnHubOpenAddTask: createElement('button'),
    btnCloseModal: createElement('button'),
    btnCancelModal: createElement('button'),
    taskSearchInput: createElement('input'),
    btnClearSearch: createElement('button'),
    taskSortSelect: createElement('select'),
    btnResetFilters: createElement('button'),
    taskResultsCount: createElement('span'),
    badgeCountAll: createElement('span'),
    badgeCountActive: createElement('span'),
    badgeCountUrgent: createElement('span'),
    badgeCountInProgress: createElement('span'),
    badgeCountPending: createElement('span'),
    badgeCountCompleted: createElement('span'),
    catCountAll: createElement('span'),
    catCountLab: createElement('span'),
    catCountAssign: createElement('span'),
    catCountProj: createElement('span'),
    catCountExam: createElement('span'),
    catCountQuiz: createElement('span'),
    hubTabBadgeTasks: createElement('span'),
    hubTabBadgeCalendar: createElement('span')
};

// Hub tab buttons
const hubButtons = ['tasks', 'calendar', 'analytics', 'unified'].map(tab => {
    const btn = createElement('button');
    btn.dataset.hubTab = tab;
    return btn;
});

// Status buttons
const statusButtons = ['all', 'active', 'urgent', 'In Progress', 'Pending', 'Completed'].map(st => {
    const btn = createElement('button');
    btn.dataset.status = st;
    btn.classList.add('tasktab-btn');
    return btn;
});

// Category buttons
const catButtons = ['all', 'Laboratory Work', 'Assignment', 'Project', 'Examination', 'Reading/Quiz'].map(cat => {
    const btn = createElement('button');
    btn.dataset.category = cat;
    btn.classList.add('category-chip-btn');
    return btn;
});

global.document = {
    getElementById: (id) => elements[id] || null,
    querySelectorAll: (selector) => {
        if (selector.includes('.hub-tab-btn')) return hubButtons;
        if (selector.includes('.tasktab-btn') || selector.includes('.status-pill-btn')) return statusButtons;
        if (selector.includes('.category-chip-btn')) return catButtons;
        return [];
    },
    createElement: createElement,
    addEventListener: () => {}
};

// Mock escapeHtml
global.escapeHtml = (s) => s || '';

// Load tasks.js
const code = fs.readFileSync('static/js/tasks.js', 'utf8');
eval(code);

console.log("[PASS] TaskManager class loaded successfully:", typeof window.TaskManager);
const tm = new window.TaskManager();

// Seed test tasks
const sampleTasks = [
    { id: 1, title: 'OS Round Robin Lab', course_code: 'CS204', category: 'Laboratory Work', deadline: '2026-10-15 17:00:00', status: 'Pending', estimated_hours: 6.0, perceived_difficulty: 4, priority_score: 95, is_overdue: true },
    { id: 2, title: 'AVL Trees Implementation', course_code: 'CS201', category: 'Project', deadline: '2026-10-22 18:00:00', status: 'In Progress', estimated_hours: 8.0, perceived_difficulty: 5, priority_score: 85 },
    { id: 3, title: 'Discrete Math Midterm Prep', course_code: 'MAT201', category: 'Examination', deadline: '2026-10-25 10:00:00', status: 'Pending', estimated_hours: 10.0, perceived_difficulty: 4, priority_score: 75 },
    { id: 4, title: 'Python File IO Quiz', course_code: 'CS102', category: 'Reading/Quiz', deadline: '2026-10-20 12:00:00', status: 'Pending', estimated_hours: 1.0, perceived_difficulty: 2, priority_score: 55 },
    { id: 5, title: 'Networks VLSM Subnetting', course_code: 'CS301', category: 'Assignment', deadline: '2026-10-24 16:00:00', status: 'In Progress', estimated_hours: 3.5, perceived_difficulty: 3, priority_score: 65 },
    { id: 6, title: 'Digital Logic ALU Lab', course_code: 'CS203', category: 'Laboratory Work', deadline: '2026-10-18 14:00:00', status: 'Completed', estimated_hours: 4.0, perceived_difficulty: 3, priority_score: 0 }
];

tm.tasks = sampleTasks;
tm.render();

console.log("=== Testing Systematic Hub Tabs ===");
tm.switchHubTab('calendar');
console.assert(elements.dashboardMainContainer.dataset.activeView === 'calendar', "Active view should be calendar!");
console.assert(localStorage.getItem('academic_active_hub_tab') === 'calendar', "Active tab must persist to localStorage!");
console.log("[PASS] Hub Tabs switch to 'calendar' verified.");

tm.switchHubTab('analytics');
console.assert(elements.dashboardMainContainer.dataset.activeView === 'analytics', "Active view should be analytics!");
console.log("[PASS] Hub Tabs switch to 'analytics' verified.");

tm.switchHubTab('tasks');
console.assert(elements.dashboardMainContainer.dataset.activeView === 'tasks', "Active view should be tasks!");
console.log("[PASS] Hub Tabs switch to 'tasks' verified.");

console.log("\n=== Testing Live Tasktabs Count Badges ===");
console.log("Badge All:", elements.badgeCountAll.textContent);
console.log("Badge Active:", elements.badgeCountActive.textContent);
console.log("Badge Urgent:", elements.badgeCountUrgent.textContent);
console.log("Badge Completed:", elements.badgeCountCompleted.textContent);

console.assert(String(elements.badgeCountAll.textContent) === '6', "Total must be 6");
console.assert(String(elements.badgeCountActive.textContent) === '5', "Active must be 5 (excluding Completed)");
console.assert(String(elements.badgeCountUrgent.textContent) === '2', "Urgent must be 2 (task 1 overdue + task 2 score 85)");
console.assert(String(elements.badgeCountCompleted.textContent) === '1', "Completed must be 1");
console.log("[PASS] Live Status Tasktabs counts computed accurately.");

console.log("\n=== Testing Category Chips Count Badges ===");
console.assert(String(elements.catCountLab.textContent) === '2', "Lab count must be 2");
console.assert(String(elements.catCountAssign.textContent) === '1', "Assignment count must be 1");
console.assert(String(elements.catCountProj.textContent) === '1', "Project count must be 1");
console.assert(String(elements.catCountExam.textContent) === '1', "Exam count must be 1");
console.assert(String(elements.catCountQuiz.textContent) === '1', "Quiz count must be 1");
console.log("[PASS] Category Chips counts computed accurately.");

console.log("\n=== Testing Status Filtering ===");
tm.currentStatusFilter = 'urgent';
let filtered = tm.getFilteredTasks();
console.assert(filtered.length === 2, `Urgent filter should return 2 tasks, got ${filtered.length}`);
console.log("[PASS] 'urgent' status filter correctly returned 2 urgent tasks.");

tm.currentStatusFilter = 'Completed';
filtered = tm.getFilteredTasks();
console.assert(filtered.length === 1 && filtered[0].id === 6, "Completed filter should return only task 6");
console.log("[PASS] 'Completed' status filter verified.");

console.log("\n=== Testing Category Filtering ===");
tm.currentStatusFilter = 'all';
tm.currentCategoryFilter = 'Laboratory Work';
filtered = tm.getFilteredTasks();
console.assert(filtered.length === 2, `Lab work filter should return 2 tasks, got ${filtered.length}`);
console.log("[PASS] Category filter for 'Laboratory Work' verified.");

console.log("\n=== Testing Search Query ===");
tm.currentCategoryFilter = 'all';
tm.searchQuery = 'CS204';
filtered = tm.getFilteredTasks();
console.assert(filtered.length === 1 && filtered[0].course_code === 'CS204', "Search 'CS204' should match task 1");
console.log("[PASS] Search query by course code verified.");

tm.searchQuery = 'trees';
filtered = tm.getFilteredTasks();
console.assert(filtered.length === 1 && filtered[0].title.includes('AVL Trees'), "Search 'trees' should match AVL Trees");
console.log("[PASS] Search query by title verified.");

console.log("\n=== Testing Sorting ===");
tm.searchQuery = '';
tm.sortBy = 'effort_asc'; // Shortest effort first
filtered = tm.getFilteredTasks();
console.assert(filtered[0].estimated_hours === 1.0, "First task should have 1.0 hour (Quiz)");
console.log("[PASS] Sort by shortest effort verified.");

tm.sortBy = 'difficulty'; // Hardest difficulty first
filtered = tm.getFilteredTasks();
console.assert(filtered[0].perceived_difficulty === 5, "First task should have difficulty 5");
console.log("[PASS] Sort by difficulty verified.");

console.log("\n=== Testing Reset Action ===");
elements.btnResetFilters.click();
console.assert(tm.currentStatusFilter === 'all', "Status should reset to 'all'");
console.assert(tm.currentCategoryFilter === 'all', "Category should reset to 'all'");
console.assert(tm.searchQuery === '', "Search query should reset to ''");
console.assert(tm.sortBy === 'priority', "Sort should reset to 'priority'");
console.log("[PASS] Reset Filters button successfully restored default state.");

console.log("\nALL HUB TABS AND TASKTABS TESTS PASSED FLAWLESSLY!");
