import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // ✅ add this
import { StudySessionService, StudySession } from '../study-session.service';

@Component({
  selector: 'app-study-session',
  standalone: true,                 // ✅ standalone component
  imports: [CommonModule],          // ✅ include NgFor, NgIf, etc.
  templateUrl: './study-session.html',
  styleUrls: ['./study-session.css']
})
export class StudySessionComponent implements OnInit {
  sessions: StudySession[] = [];

  constructor(private studyService: StudySessionService) {}

  ngOnInit() {
    this.loadSessions();
  }

  loadSessions() {
    this.studyService.getAll().subscribe(data => this.sessions = data);
  }

  addSession() {
    const newSession: StudySession = {
      subject: 'Algorithms',
      duration: 60,
      notes: 'Reviewed Prim’s algorithm'
    };
    this.studyService.addSession(newSession).subscribe(() => this.loadSessions());
  }

  deleteSession(id: number) {
    this.studyService.deleteSession(id).subscribe(() => this.loadSessions());
  }
}
