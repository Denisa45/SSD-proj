import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // ✅ Register
  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/auth/register`, { username, password });
  }

  // ✅ Login
  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.BASE_URL}/auth/login`, { username, password });
  }

  // ✅ Get all courses for current user
  getCourses(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.BASE_URL}/courses`, { headers });
  }

  // ✅ Add course with token
  addCourse(courseData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.BASE_URL}/courses`, courseData, { headers });
  }

  // ✅ Delete course with token
  deleteCourse(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(`${this.BASE_URL}/courses/${id}`, { headers });
  }
}
