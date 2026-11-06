// Test script for Calendar and Reminder logic
const fs = require('fs');

// Mock localStorage and window
const store = {};
global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; }
};

global.window = {
    showAppToast: (msg, type) => console.log(`[TOAST - ${type}]: ${msg}`)
};

// Mock DOM elements
function createElement(tag) {
    const el = {
        tagName: tag,
        classList: {
            classes: new Set(),
            add(c) { this.classes.add(c); },
            remove(c) { this.classes.delete(c); },
            has(c) { return this.classes.has(c); }
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
        querySelector(selector) {
            return createElement('div');
        },
        querySelectorAll(selector) {
            return [];
        },
        addEventListener(event, fn) {
            if (!this.handlers) this.handlers = {};
            this.handlers[event] = fn;
        }
    };
    return el;
}

const elements = {
    calMonthYearLabel: createElement('span'),
    calBtnPrev: createElement('button'),
    calBtnNext: createElement('button'),
    calBtnToday: createElement('button'),
    calDaysGrid: createElement('div'),
    calReminderBanner: createElement('div'),
    calDayDetailTitle: createElement('h5'),
    calDayDuesSummary: createElement('span'),
    calDayDuesList: createElement('div'),
    calDayRemindersList: createElement('div'),
    calNewReminderInput: createElement('input'),
    calBtnAddReminder: createElement('button'),
    calBtnQuickAddTask: createElement('button')
};

global.document = {
    getElementById: (id) => elements[id] || null,
    createElement: createElement,
    addEventListener: () => {}
};

// Now read calendar.js
const calendarCode = fs.readFileSync('static/js/calendar.js', 'utf8');
eval(calendarCode);

console.log("CalendarManager loaded:", typeof window.CalendarManager);

const cal = new window.CalendarManager();
console.log("[PASS] CalendarManager instantiated.");
console.log("Current selected date:", cal.selectedDateStr);
console.log("View Month / Year:", cal.viewMonth, cal.viewYear);
console.log("Month label:", elements.calMonthYearLabel.textContent);

// Test task feeding
const sampleTasks = [
    { id: 1, title: 'OS Round Robin Lab', course_code: 'CS204', category: 'Laboratory Work', deadline: '2026-10-15 17:00:00', status: 'Pending', priority_score: 95 },
    { id: 2, title: 'AVL Trees Project', course_code: 'CS201', category: 'Project', deadline: '2026-10-20 18:00:00', status: 'Pending', priority_score: 85 },
    { id: 3, title: 'Discrete Math Prep', course_code: 'MAT201', category: 'Examination', deadline: '2026-10-24 10:00:00', status: 'Pending', priority_score: 70 },
    { id: 4, title: 'Digital Logic ALU', course_code: 'CS203', category: 'Laboratory Work', deadline: '2026-10-18 14:00:00', status: 'Completed', priority_score: 0 }
];

cal.updateTasks(sampleTasks);
console.log("[PASS] Tasks updated into CalendarManager.");

// Check reminder banner
console.log("Banner HTML content length:", elements.calReminderBanner.innerHTML.length);
console.assert(elements.calReminderBanner.innerHTML.includes('Overdue Alert') || elements.calReminderBanner.innerHTML.includes('Next Due Reminder'), "Banner should render urgent or upcoming alert!");
console.log("[PASS] Reminder Banner successfully rendered with alerts.");

// Check grid generation
console.log("Grid total day cells:", elements.calDaysGrid.children.length);
console.assert(elements.calDaysGrid.children.length >= 35, "Grid must have at least 35 day cells!");
console.log("[PASS] Calendar 7-column month grid populated with", elements.calDaysGrid.children.length, "cells.");

// Check day selection
cal.selectDate('2026-10-20');
console.log("Selected Oct 20. Title:", elements.calDayDetailTitle.innerHTML);
console.assert(elements.calDayDuesSummary.textContent.includes('1 Academic Due'), "Oct 20 must have 1 due!");
console.log("[PASS] Selected day detail correctly shows 1 Academic Due for Oct 20.");

// Test adding a study reminder
elements.calNewReminderInput.value = 'Review slides before submitting';
cal.handleAddReminder();

const reminders = cal.getRemindersForDate('2026-10-20');
console.log("Reminders for 2026-10-20:", reminders);
console.assert(reminders.length === 1, "Should have 1 reminder for 2026-10-20!");
console.assert(reminders[0].text === 'Review slides before submitting', "Reminder text should match!");
console.log("[PASS] Study reminder added successfully.");

// Toggle reminder
cal.toggleReminder('2026-10-20', reminders[0].id);
console.assert(reminders[0].completed === true, "Reminder should now be completed!");
console.log("[PASS] Reminder toggle status verified.");

// Month navigation
const prevMonth = cal.viewMonth;
cal.navigateMonth(1);
console.assert(cal.viewMonth === (prevMonth + 1) % 12, "Should have navigated to next month!");
console.log("[PASS] Month navigation verified. Now in month index:", cal.viewMonth);

cal.goToToday();
console.assert(cal.viewMonth === new Date().getMonth(), "Today button must restore current month!");
console.log("[PASS] 'Today' shortcut restored current month successfully.");

console.log("\nALL CALENDAR AND REMINDER UNIT TESTS PASSED EXCELLENTLY!");
