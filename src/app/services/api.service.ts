import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // 📦 Utility: Builds auth header
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // 🔹 AUTH
  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/auth/register`, { username, password });
  }

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.BASE_URL}/auth/login`, { username, password });
  }

  // 🔹 COURSES
  getCourses(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.BASE_URL}/courses`, { headers });
  }

  getCourseById(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.BASE_URL}/courses/${id}`, { headers });
  }

  addCourse(courseData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.BASE_URL}/courses`, courseData, { headers });
  }

  updateCourse(courseId: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.BASE_URL}/courses/${courseId}`, data, { headers });
  }

  deleteCourse(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.BASE_URL}/courses/${id}`, { headers });
  }

  // 🔹 TASKS
  addTaskCourse(courseId: number, taskName: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(
      `${this.BASE_URL}/courses/${courseId}/tasks`,
      { name: taskName },
      { headers }
    );
  }

  toggleTaskCourse(courseId: number, taskName: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(
      `${this.BASE_URL}/courses/${courseId}/tasks/toggle`,
      { name: taskName },
      { headers }
    );
  }

  removeTask(courseId: number, taskName: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(
      `${this.BASE_URL}/courses/${courseId}/tasks/remove`,
      { name: taskName },
      { headers } // ✅ wrapped correctly
    );
  }

  uploadMaterial(courseId:number,file:File):Observable<any>{
    const token = localStorage.getItem('token');
     const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
      });
    const formData=new FormData();
    formData.append('file',file);

    return this.http.post(`${this.BASE_URL}/courses/${courseId}/materials/`,formData,{headers});

  }
  removeMaterial(courseId: number, fileName: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
  return this.http.delete(`${this.BASE_URL}/courses/${courseId}/materials/${fileName}`, { headers });
}

   

}
