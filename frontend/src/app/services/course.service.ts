import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Course {
  id?: number;
  name: string;
  description: string;
  tasks?: any[];
  materials?: any[];
  grades?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = 'http://localhost:3000/courses';

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

  // Frontend getCourseById usually only needs ID, backend handles user check via token
  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // --- TASKS ---
  addTask(courseId: number, taskName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/tasks`, { taskName }, this.getAuthHeaders());
  }

  toggleTask(courseId: number, taskName: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${courseId}/tasks/toggle`, { taskName }, this.getAuthHeaders());
  }

  removeTask(courseId: number, taskName: string): Observable<any> {
    const options = { ...this.getAuthHeaders(), body: { taskName } };
    return this.http.delete(`${this.apiUrl}/${courseId}/tasks`, options);
  }

  // --- MATERIALS ---
  uploadCourseFile(courseId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name); 
    return this.http.post(`${this.apiUrl}/${courseId}/materials`, formData, this.getAuthHeaders());
  }

  removeMaterial(courseId: string | number, filename: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${courseId}/materials/${encodeURIComponent(filename)}`, this.getAuthHeaders());
  }

  // --- GRADES ---
  addGrade(courseId: number, gradeValue: number, gradeName: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${courseId}/grades`,
      { score: gradeValue, name: gradeName }, // Match what backend expects
      this.getAuthHeaders()
    );
  }

  // Add this inside CourseService class in src/app/services/course.service.ts

  removeGrade(courseId: number, gradeName: string): Observable<any> {
    // This sends the DELETE request to: /courses/1/grades/Midterm
    return this.http.delete(
        `${this.apiUrl}/${courseId}/grades/${encodeURIComponent(gradeName)}`,
        this.getAuthHeaders()
    );
  }

  // In FRONTEND (Angular) course.service.ts

  deleteCourse(id: number): Observable<any> {
    // This talks to the backend controller
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}