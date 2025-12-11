import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ScheduleItem {
  id?: number;
  day: string;       // e.g. 'Monday'
  startTime: string; // e.g. '08:00'
  subject: string;
  room: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = 'http://localhost:3000/schedule';

  constructor(private http: HttpClient) {}

  // Get all classes
  getSchedule(): Observable<ScheduleItem[]> {
    return this.http.get<ScheduleItem[]>(this.apiUrl);
  }

  // Save (or update) a specific cell
  saveSlot(day: string, startTime: string, subject: string, room: string) {
    return this.http.post(this.apiUrl, { day, startTime, subject, room });
  }
}