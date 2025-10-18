import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

export interface User {
  name: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  register(user: User): Observable<User> {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === user.email)) {
      return throwError(() => new Error('Email already registered'));
    }
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    return of(user);
  }

  login(email: string, password: string): Observable<User> {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return throwError(() => new Error('Invalid credentials'));
    return of(user);
  }

    setLoggedInUser(user: User) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  getLoggedInUser(): User | null {
    const userData = localStorage.getItem('loggedInUser');
    return userData ? JSON.parse(userData) : null;
  }

  logout() {
    localStorage.removeItem('loggedInUser');
  }

}
