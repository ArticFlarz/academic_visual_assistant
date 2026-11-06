/**
 * Chart.js Analytics & Cognitive Load Visualization
 * Renders warm-toned academic workload charts and cognitive stress meters.
 */

class AnalyticsManager {
    constructor() {
        this.chartCategory = null;
        this.chartUrgency = null;
        this.chartTimeline = null;

        this.init();
    }

    init() {
        // Only run if canvas elements exist
        if (!document.getElementById('chartCategory')) return;
        this.loadAnalytics();
    }

    async loadAnalytics() {
        try {
            const res = await fetch('/api/analytics');
            const data = await res.json();
            if (data.success) {
                this.updateMetrics(data.summary);
                this.renderCategoryChart(data.category_hours);
                this.renderUrgencyChart(data.urgency_distribution);
                this.renderTimelineChart(data.timeline);
                this.renderQuickWins(data.quick_wins);
            }
        } catch (err) {
            console.error("Failed to load analytics data:", err);
        }
    }

    updateMetrics(summary) {
        // Summary metrics
        const elActiveHours = document.getElementById('metricActiveHours');
        const elCompletionRate = document.getElementById('metricCompletionRate');
        const elActiveCount = document.getElementById('metricActiveCount');
        const elCompletedCount = document.getElementById('metricCompletedCount');

        if (elActiveHours) elActiveHours.textContent = `${summary.total_active_hours}h`;
        if (elCompletionRate) elCompletionRate.textContent = `${summary.completion_rate}%`;
        if (elActiveCount) elActiveCount.textContent = summary.active_tasks;
        if (elCompletedCount) elCompletedCount.textContent = summary.completed_tasks;

        // Stress Dial
        const dialNumber = document.getElementById('stressDialNumber');
        const dialFill = document.getElementById('stressDialFill');
        const stressStatus = document.getElementById('cognitiveStatus');
        const stressTip = document.getElementById('cognitiveTip');

        if (dialNumber) dialNumber.textContent = summary.stress_index;
        if (stressStatus) stressStatus.textContent = summary.stress_level;
        if (stressTip) stressTip.textContent = summary.stress_msg;

        if (dialFill) {
            // Circumference of 2 * pi * 25 ~= 157
            const circumference = 157;
            const offset = circumference - (summary.stress_index / 100) * circumference;
            dialFill.style.strokeDashoffset = offset;
            dialFill.style.stroke = summary.stress_color;
        }
    }

    renderCategoryChart(catHours) {
        const ctx = document.getElementById('chartCategory');
        if (!ctx) return;

        const labels = Object.keys(catHours);
        const data = Object.values(catHours);

        // Warm Palette
        const warmPalette = [
            '#D96B43', // Terracotta (Assignment)
            '#E08E45', // Amber (Lab)
            '#8B5E83', // Plum (Project)
            '#C84B31', // Crimson (Exam)
            '#588157'  // Sage (Quiz)
        ];

        if (this.chartCategory) {
            this.chartCategory.data.labels = labels;
            this.chartCategory.data.datasets[0].data = data;
            this.chartCategory.update();
            return;
        }

        this.chartCategory = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: warmPalette,
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: '500' },
                            color: '#63574E',
                            padding: 14
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` ${ctx.label}: ${ctx.raw} hours`
                        }
                    }
                },
                cutout: '68%'
            }
        });
    }

    renderUrgencyChart(urgencyDist) {
        const ctx = document.getElementById('chartUrgency');
        if (!ctx) return;

        const labels = ['Critical', 'Immediate', 'High', 'Moderate', 'Low'];
        const values = [
            urgencyDist['Critical / Overdue'] || 0,
            urgencyDist['Immediate Action'] || 0,
            urgencyDist['High Urgency'] || 0,
            urgencyDist['Moderate'] || 0,
            urgencyDist['Low Horizon'] || 0
        ];

        const barColors = ['#C84B31', '#D96B43', '#E08E45', '#EAA838', '#588157'];

        if (this.chartUrgency) {
            this.chartUrgency.data.datasets[0].data = values;
            this.chartUrgency.update();
            return;
        }

        this.chartUrgency = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tasks',
                    data: values,
                    backgroundColor: barColors,
                    borderRadius: 6,
                    maxBarThickness: 32
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, color: '#96897E' },
                        grid: { color: 'rgba(234, 225, 211, 0.6)' }
                    },
                    x: {
                        ticks: { color: '#63574E', font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 } },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    renderTimelineChart(timeline) {
        const ctx = document.getElementById('chartTimeline');
        if (!ctx) return;

        const labels = timeline.labels || [];
        const hours = timeline.hours || [];
        const cap = timeline.sustainable_cap || 4.5;
        const capLine = new Array(labels.length).fill(cap);

        if (this.chartTimeline) {
            this.chartTimeline.data.labels = labels;
            this.chartTimeline.data.datasets[0].data = hours;
            this.chartTimeline.data.datasets[1].data = capLine;
            this.chartTimeline.update();
            return;
        }

        this.chartTimeline = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Estimated Workload (Hrs)',
                        data: hours,
                        borderColor: '#D96B43',
                        backgroundColor: 'rgba(217, 107, 67, 0.12)',
                        fill: true,
                        tension: 0.35,
                        pointBackgroundColor: '#D96B43',
                        pointRadius: 4
                    },
                    {
                        label: 'Recommended Daily Study Cap (4.5h)',
                        data: capLine,
                        borderColor: '#588157',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 12,
                            color: '#63574E',
                            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Hours Due', color: '#96897E' },
                        ticks: { color: '#96897E' },
                        grid: { color: 'rgba(234, 225, 211, 0.6)' }
                    },
                    x: {
                        ticks: { color: '#63574E', font: { size: 10 } },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    renderQuickWins(quickWins) {
        const container = document.getElementById('quickWinsContainer');
        if (!container) return;

        if (!quickWins || quickWins.length === 0) {
            container.innerHTML = `
                <p style="font-size:0.82rem; color:var(--text-secondary); margin-top:0.4rem;">
                    No quick wins pending right now. Great job keeping smaller tasks clear!
                </p>
            `;
            return;
        }

        container.innerHTML = '';
        quickWins.forEach(task => {
            const item = document.createElement('div');
            item.className = 'quick-win-item';
            item.innerHTML = `
                <div>
                    <span class="quick-win-title">${escapeHtml(task.title)}</span>
                    <div style="font-size:0.75rem; color:var(--text-tertiary); margin-top:0.15rem;">
                        ${task.course_code ? `[${task.course_code}] ` : ''}${task.category}
                    </div>
                </div>
                <span class="quick-win-time">⚡ ${task.estimated_hours}h</span>
            `;
            container.appendChild(item);
        });
    }

    resizeCharts() {
        if (this.chartCategory) this.chartCategory.resize();
        if (this.chartUrgency) this.chartUrgency.resize();
        if (this.chartTimeline) this.chartTimeline.resize();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.analyticsManager = new AnalyticsManager();
});
