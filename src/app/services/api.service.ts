import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private BASE_URL = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, { username, password });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, { username, password });
  }
}
