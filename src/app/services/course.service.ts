import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Course {
  id?: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = 'http://localhost:5000/courses';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl, this.getAuthHeaders());
  }

  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course, this.getAuthHeaders());
  }
}
