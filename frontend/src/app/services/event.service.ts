import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  id?: number;
  title: string;
  description: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  // 🔒 HARDCODED PORT 3000 to prevent any mistakes
  private apiUrl = 'http://localhost:3000/events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  addEvent(event: Event): Observable<Event> {
    console.log('Service sending to:', this.apiUrl, event); // 🔍 Debug log
    return this.http.post<Event>(this.apiUrl, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  updateEvent(id: number, event: Partial<Event>): Observable<Event> {
    return this.http.patch<Event>(`${this.apiUrl}/${id}`, event);
  }
}