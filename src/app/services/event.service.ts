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

  private apiUrl = 'http://localhost:5000/api/events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

   getEvent(id: number) {
  return this.http.get<Event>(`${this.apiUrl}/${id}`);
}

updateEvent(id: number, data: Partial<Event>) {
  return this.http.patch<Event>(`${this.apiUrl}/${id}`, data);
}


}
