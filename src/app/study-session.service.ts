import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StudySession {
  id?: number;
  subject: string;
  duration: number;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudySessionService {
  private apiUrl = 'http://localhost:3000/study-sessions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<StudySession[]> {
    return this.http.get<StudySession[]>(this.apiUrl);
  }

  addSession(session: StudySession): Observable<StudySession> {
    return this.http.post<StudySession>(this.apiUrl, session);
  }

  deleteSession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
