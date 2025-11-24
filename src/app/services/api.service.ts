import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = 'http://localhost:5000';

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

  login(identifier: string, password: string) {
  return this.http.post<any>(
    `${this.BASE_URL}/auth/login`,
    { identifier, password }
  );
}


  // 🔹 COURSES
  getCourses(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.BASE_URL}/courses`, { headers });
  }

getCourseById(id: string): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get<any>(`${this.BASE_URL}/courses/${id}`, { headers });
}


  addCourse(courseData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.BASE_URL}/courses`, courseData, { headers });
  }

   updateCourse(courseId: string, data: any): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.put(`${this.BASE_URL}/courses/${courseId}`, data, { headers });
}


  deleteCourse(courseId: string): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.delete(`${this.BASE_URL}/courses/${courseId}`, { headers });
}


  // 🔹 TASKS
 
addTaskCourse(courseId: string, taskName: string) {
  return this.http.post(`${this.BASE_URL}/courses/${courseId}/tasks`, { task: taskName });
}


toggleTaskCourse(courseId: string, taskName: string) {
  return this.http.patch(
    `${this.BASE_URL}/courses/${courseId}/tasks/${encodeURIComponent(taskName)}/toggle`,
    {}
  );
}


removeTask(courseId: string, taskName: string) {
  return this.http.post(
    `${this.BASE_URL}/courses/${courseId}/tasks/remove`,
    { name: taskName }
  );
}



  uploadMaterial(courseId: string, formData: FormData): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  return this.http.post(
    `${this.BASE_URL}/courses/${courseId}/upload`,
    formData,
    { headers }
  );
}


removeMaterial(courseId: string, fileName: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  return this.http.delete(
    `${this.BASE_URL}/courses/${courseId}/materials/${fileName}`,
    { headers }
  );
}


addGrade(courseId: string, grade: number) {
  return this.http.post(`${this.BASE_URL}/courses/${courseId}/grades`, { grade });
}

removeGrade(courseId: string, index: number) {
  return this.http.post(`${this.BASE_URL}/courses/${courseId}/grades/remove`, { index });
}


 updateUsername(newUsername: string) {
  return this.http.patch(
    "http://localhost:5000/auth/update-username",
    { newUsername },
    { headers: this.getAuthHeaders() }
  );
}


updateEmail(newEmail: string) {
  return this.http.patch(
    "http://localhost:5000/auth/update-email",
    { newEmail },
    { headers: this.getAuthHeaders() }
  );
}

updatePassword(oldPassword: string, newPassword: string) {
  return this.http.patch(
    "http://localhost:5000/auth/update-password",
    { oldPassword, newPassword },
    { headers: this.getAuthHeaders() }
  );
}




}
