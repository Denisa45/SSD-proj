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

  timeLeft = 25 * 60;   // 25 minutes in seconds
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
    this.isBreak = false;
    this.timeLeft = 25 * 60;
  }

  handleTimerEnd() {
    clearInterval(this.interval);
    this.isRunning = false;

    if (!this.isBreak) {
      // STUDY SESSION COMPLETED
      this.saveSession({
        type: 'Study',
        duration: '25 min',
        date: new Date().toLocaleString()
      });

      this.notify("Time's up!", "Take a 5 minute break.");
      this.startBreak();
    } else {
      // BREAK COMPLETED
      this.notify("Break finished!", "Start studying again.");
      this.startStudy();
    }
  }

  startBreak() {
    this.isBreak = true;
    this.timeLeft = 5 * 60;
    this.startTimer();
  }

  startStudy() {
    this.isBreak = false;
    this.timeLeft = 25 * 60;
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
