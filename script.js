// Time Logger Dashboard JavaScript

class TimeLogger {
    constructor() {
        this.isActive = false;
        this.isOnBreak = false;
        this.startTime = null;
        this.breakStartTime = null;
        this.totalBreakTime = 0;
        this.sessionTime = 0;
        this.dailyGoal = 8; // hours
        
        this.initializeElements();
        this.loadData();
        this.initializeEventListeners();
        this.startClock();
        this.updateDisplay();
        this.updateWeeklySummary();
    }

    initializeElements() {
        // Clock elements
        this.currentTimeEl = document.getElementById('currentTime');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');
        this.sessionTimeEl = document.getElementById('sessionTime');
        
        // Buttons
        this.clockInBtn = document.getElementById('clockInBtn');
        this.clockOutBtn = document.getElementById('clockOutBtn');
        this.breakBtn = document.getElementById('breakBtn');
        
        // Stats
        this.todayTotalEl = document.getElementById('todayTotal');
        this.weekTotalEl = document.getElementById('weekTotal');
        this.breakTimeEl = document.getElementById('breakTime');
        this.goalProgressEl = document.getElementById('goalProgress');
        this.goalPercentageEl = document.getElementById('goalPercentage');
        
        // Activity
        this.activityList = document.getElementById('activityList');
        
        // Settings
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettingsBtn = document.getElementById('closeSettings');
        this.dailyGoalInput = document.getElementById('dailyGoal');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        
        // Status dot
        this.statusDot = this.statusIndicator.querySelector('.status-dot');
    }

    initializeEventListeners() {
        this.clockInBtn.addEventListener('click', () => this.clockIn());
        this.clockOutBtn.addEventListener('click', () => this.clockOut());
        this.breakBtn.addEventListener('click', () => this.toggleBreak());
        
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        
        // Close modal when clicking outside
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettings();
            }
        });
    }

    loadData() {
        const savedData = localStorage.getItem('timeLoggerData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.dailyGoal = data.dailyGoal || 8;
            this.dailyGoalInput.value = this.dailyGoal;
        }
    }

    saveData() {
        const data = {
            dailyGoal: this.dailyGoal,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem('timeLoggerData', JSON.stringify(data));
    }

    startClock() {
        setInterval(() => {
            this.updateCurrentTime();
            if (this.isActive && !this.isOnBreak) {
                this.updateSessionTime();
            }
        }, 1000);
    }

    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        this.currentTimeEl.textContent = timeString;
    }

    updateSessionTime() {
        if (this.startTime) {
            const now = new Date();
            this.sessionTime = Math.floor((now - this.startTime - this.totalBreakTime) / 1000);
            this.sessionTimeEl.textContent = this.formatTime(this.sessionTime);
        }
    }

    clockIn() {
        this.isActive = true;
        this.startTime = new Date();
        this.sessionTime = 0;
        this.totalBreakTime = 0;
        
        this.updateStatus('Clocked In', 'active');
        this.clockInBtn.disabled = true;
        this.clockOutBtn.disabled = false;
        this.breakBtn.disabled = false;
        
        this.addActivity('Clocked In', 'clock-in');
        this.updateDisplay();
    }

    clockOut() {
        if (!this.isActive) return;
        
        if (this.isOnBreak) {
            this.endBreak();
        }
        
        const endTime = new Date();
        const totalWorkTime = Math.floor((endTime - this.startTime - this.totalBreakTime) / 1000);
        
        this.saveWorkSession(this.startTime, endTime, totalWorkTime, this.totalBreakTime);
        
        this.isActive = false;
        this.isOnBreak = false;
        this.startTime = null;
        this.sessionTime = 0;
        this.totalBreakTime = 0;
        
        this.updateStatus('Clocked Out', 'inactive');
        this.clockInBtn.disabled = false;
        this.clockOutBtn.disabled = true;
        this.breakBtn.disabled = true;
        
        this.sessionTimeEl.textContent = '00:00:00';
        this.addActivity('Clocked Out', 'clock-out');
        this.updateDisplay();
    }

    toggleBreak() {
        if (this.isOnBreak) {
            this.endBreak();
        } else {
            this.startBreak();
        }
    }

    startBreak() {
        this.isOnBreak = true;
        this.breakStartTime = new Date();
        
        this.updateStatus('On Break', 'break');
        this.breakBtn.innerHTML = '<i class="fas fa-play"></i> End Break';
        this.breakBtn.classList.remove('btn-warning');
        this.breakBtn.classList.add('btn-secondary');
        
        this.addActivity('Started Break', 'break-start');
    }

    endBreak() {
        if (this.breakStartTime) {
            const breakDuration = new Date() - this.breakStartTime;
            this.totalBreakTime += breakDuration;
        }
        
        this.isOnBreak = false;
        this.breakStartTime = null;
        
        this.updateStatus('Clocked In', 'active');
        this.breakBtn.innerHTML = '<i class="fas fa-coffee"></i> Break';
        this.breakBtn.classList.remove('btn-secondary');
        this.breakBtn.classList.add('btn-warning');
        
        this.addActivity('Ended Break', 'break-end');
        this.updateDisplay();
    }

    updateStatus(text, status) {
        this.statusText.textContent = text;
        this.statusDot.className = 'status-dot';
        if (status === 'active') {
            this.statusDot.classList.add('active');
        } else if (status === 'break') {
            this.statusDot.classList.add('break');
        }
    }

    addActivity(action, type) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Remove placeholder if it exists
        const placeholder = this.activityList.querySelector('.placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const icon = this.getActivityIcon(type);
        activityItem.innerHTML = `
            <i class="${icon}"></i>
            <span>${action}</span>
            <span class="activity-time">${timeString}</span>
        `;
        
        this.activityList.insertBefore(activityItem, this.activityList.firstChild);
        
        // Keep only last 10 activities
        const activities = this.activityList.querySelectorAll('.activity-item:not(.placeholder)');
        if (activities.length > 10) {
            activities[activities.length - 1].remove();
        }
    }

    getActivityIcon(type) {
        const icons = {
            'clock-in': 'fas fa-play',
            'clock-out': 'fas fa-stop',
            'break-start': 'fas fa-coffee',
            'break-end': 'fas fa-play'
        };
        return icons[type] || 'fas fa-circle';
    }

    saveWorkSession(startTime, endTime, workTime, breakTime) {
        const sessions = this.getStoredSessions();
        const session = {
            date: startTime.toDateString(),
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            workTime: workTime,
            breakTime: breakTime
        };
        
        sessions.push(session);
        localStorage.setItem('workSessions', JSON.stringify(sessions));
    }

    getStoredSessions() {
        const sessions = localStorage.getItem('workSessions');
        return sessions ? JSON.parse(sessions) : [];
    }

    updateDisplay() {
        this.updateTodayTotal();
        this.updateWeekTotal();
        this.updateBreakTime();
        this.updateGoalProgress();
        this.updateWeeklySummary();
    }

    updateTodayTotal() {
        const today = new Date().toDateString();
        const sessions = this.getStoredSessions();
        const todaySessions = sessions.filter(session => session.date === today);
        
        let totalSeconds = todaySessions.reduce((total, session) => total + session.workTime, 0);
        
        // Add current session if active
        if (this.isActive && !this.isOnBreak) {
            totalSeconds += this.sessionTime;
        }
        
        this.todayTotalEl.textContent = this.formatTime(totalSeconds);
    }

    updateWeekTotal() {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
        weekStart.setHours(0, 0, 0, 0);
        
        const sessions = this.getStoredSessions();
        const weekSessions = sessions.filter(session => {
            const sessionDate = new Date(session.startTime);
            return sessionDate >= weekStart;
        });
        
        let totalSeconds = weekSessions.reduce((total, session) => total + session.workTime, 0);
        
        // Add current session if active
        if (this.isActive && !this.isOnBreak) {
            totalSeconds += this.sessionTime;
        }
        
        this.weekTotalEl.textContent = this.formatTime(totalSeconds);
    }

    updateBreakTime() {
        let breakSeconds = Math.floor(this.totalBreakTime / 1000);
        
        // Add current break time if on break
        if (this.isOnBreak && this.breakStartTime) {
            const currentBreakTime = Math.floor((new Date() - this.breakStartTime) / 1000);
            breakSeconds += currentBreakTime;
        }
        
        this.breakTimeEl.textContent = this.formatTime(breakSeconds);
    }

    updateGoalProgress() {
        const today = new Date().toDateString();
        const sessions = this.getStoredSessions();
        const todaySessions = sessions.filter(session => session.date === today);
        
        let totalSeconds = todaySessions.reduce((total, session) => total + session.workTime, 0);
        
        // Add current session if active
        if (this.isActive && !this.isOnBreak) {
            totalSeconds += this.sessionTime;
        }
        
        const goalSeconds = this.dailyGoal * 3600;
        const percentage = Math.min((totalSeconds / goalSeconds) * 100, 100);
        
        this.goalProgressEl.style.width = percentage + '%';
        this.goalPercentageEl.textContent = Math.round(percentage) + '%';
    }

    updateWeeklySummary() {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const now = new Date();
        const today = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Get Monday of current week
        const monday = new Date(now);
        monday.setDate(now.getDate() - now.getDay() + 1);
        monday.setHours(0, 0, 0, 0);
        
        const sessions = this.getStoredSessions();
        
        days.forEach((day, index) => {
            const dayDate = new Date(monday);
            dayDate.setDate(monday.getDate() + index);
            const dateString = dayDate.toDateString();
            
            const daySessions = sessions.filter(session => session.date === dateString);
            let totalSeconds = daySessions.reduce((total, session) => total + session.workTime, 0);
            
            // Add current session if it's today and active
            if (dateString === now.toDateString() && this.isActive && !this.isOnBreak) {
                totalSeconds += this.sessionTime;
            }
            
            const hours = Math.round((totalSeconds / 3600) * 10) / 10;
            const percentage = Math.min((totalSeconds / (this.dailyGoal * 3600)) * 100, 100);
            
            const hoursEl = document.getElementById(day + 'Hours');
            const progressEl = document.getElementById(day + 'Progress');
            const cardEl = document.querySelector(`[data-day="${day}"]`);
            
            if (hoursEl && progressEl && cardEl) {
                hoursEl.textContent = hours + 'h';
                progressEl.style.width = percentage + '%';
                
                // Highlight today
                if (index + 1 === today) {
                    cardEl.classList.add('today');
                } else {
                    cardEl.classList.remove('today');
                }
            }
        });
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    openSettings() {
        this.settingsModal.classList.add('active');
    }

    closeSettings() {
        this.settingsModal.classList.remove('active');
    }

    saveSettings() {
        this.dailyGoal = parseInt(this.dailyGoalInput.value) || 8;
        this.saveData();
        this.updateDisplay();
        this.closeSettings();
        
        // Show feedback
        const originalText = this.saveSettingsBtn.textContent;
        this.saveSettingsBtn.textContent = 'Saved!';
        this.saveSettingsBtn.style.background = '#10b981';
        
        setTimeout(() => {
            this.saveSettingsBtn.textContent = originalText;
            this.saveSettingsBtn.style.background = '';
        }, 1500);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TimeLogger();
});

// Add some demo data on first load
if (!localStorage.getItem('workSessions')) {
    const demoSessions = [];
    const now = new Date();
    
    // Add some demo sessions for the past few days
    for (let i = 1; i <= 5; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        
        const startTime = new Date(date);
        startTime.setHours(9, 0, 0, 0);
        
        const endTime = new Date(date);
        endTime.setHours(17, Math.floor(Math.random() * 60), 0, 0);
        
        const workTime = Math.floor((endTime - startTime) / 1000) - (Math.floor(Math.random() * 3600) + 1800); // Subtract break time
        const breakTime = Math.floor(Math.random() * 3600) + 1800; // 30-90 minutes break
        
        demoSessions.push({
            date: date.toDateString(),
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            workTime: workTime,
            breakTime: breakTime
        });
    }
    
    localStorage.setItem('workSessions', JSON.stringify(demoSessions));
}