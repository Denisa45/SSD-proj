import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-study-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class StudyTimerComponent {

  // Configuration variables (in minutes)
  studyDuration = 25;
  breakDuration = 5;

  timeLeft = this.studyDuration * 60;
  interval: any = null;
  isRunning = false;
  isBreak = false;

  sessionHistory: any[] = [];

  constructor() {
    Notification.requestPermission();
    this.loadHistory();
  }

  get formattedTime(): string {
    const m = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
    const s = (this.timeLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  startTimer() {
    if (this.isRunning) return;

    this.isRunning = true;

    this.interval = setInterval(() => {
      this.timeLeft--;

      if (this.timeLeft <= 0) {
        this.handleTimerEnd();
      }

    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
    this.isRunning = false;
  }

  resetTimer() {
    this.pauseTimer();
    // Reset to whichever mode we are currently in
    if (this.isBreak) {
        this.timeLeft = this.breakDuration * 60;
    } else {
        this.timeLeft = this.studyDuration * 60;
    }
  }

  // --- NEW FUNCTIONS FOR +/- BUTTONS ---

  adjustStudyTime(amount: number) {
    this.studyDuration += amount;
    if (this.studyDuration < 1) this.studyDuration = 1; // Minimum 1 min

    // If we are currently in Study mode and timer is NOT running, update display immediately
    if (!this.isBreak && !this.isRunning) {
        this.timeLeft = this.studyDuration * 60;
    }
  }

  adjustBreakTime(amount: number) {
    this.breakDuration += amount;
    if (this.breakDuration < 1) this.breakDuration = 1; // Minimum 1 min

    // If we are currently in Break mode and timer is NOT running, update display immediately
    if (this.isBreak && !this.isRunning) {
        this.timeLeft = this.breakDuration * 60;
    }
  }
  // -------------------------------------
  skipBreak() {
    this.pauseTimer(); // Stop the break timer
    this.isBreak = false; // Switch mode back to Study
    this.timeLeft = this.studyDuration * 60; // Reset time to study duration
    this.startTimer(); 
  }

  handleTimerEnd() {
    clearInterval(this.interval);
    this.isRunning = false;

    if (!this.isBreak) {
      // STUDY SESSION COMPLETED
      this.saveSession({
        type: 'Study',
        duration: `${this.studyDuration} min`, // Uses dynamic duration
        date: new Date().toLocaleString()
      });

      this.notify("Time's up!", `Take a ${this.breakDuration} minute break.`);
      this.startBreak();
    } else {
      // BREAK COMPLETED
      this.notify("Break finished!", "Start studying again.");
      this.startStudy();
    }
  }

  startBreak() {
    this.isBreak = true;
    this.timeLeft = this.breakDuration * 60;
    this.startTimer();
  }

  startStudy() {
    this.isBreak = false;
    this.timeLeft = this.studyDuration * 60;
    this.startTimer();
  }

  notify(title: string, body: string) {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  }

  // -------------------------
  // SESSION HISTORY
  // -------------------------
  saveSession(session: any) {
    this.sessionHistory.push(session);
    localStorage.setItem('studySessions', JSON.stringify(this.sessionHistory));
  }

  loadHistory() {
    const saved = localStorage.getItem('studySessions');
    if (saved) this.sessionHistory = JSON.parse(saved);
  }

  clearHistory() {
    this.sessionHistory = [];
    localStorage.removeItem('studySessions');
  }
}