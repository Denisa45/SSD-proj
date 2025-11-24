import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],   // <-- FIXED
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  newUsername: string = '';
  newEmail: string = '';
  oldPassword: string = '';
  newPassword: string = '';

  private apiUrl = 'http://localhost:5000/auth';

  constructor(private http: HttpClient) {}

  // ===============================
  // 🔹 CHANGE USERNAME
  // ===============================
  changeUsername() {
    if (!this.newUsername.trim()) return alert("Enter a new username");

    this.http.patch(
      `${this.apiUrl}/update-username`,
      { username: this.newUsername },
      { headers: this.getAuthHeader() }
    ).subscribe({
      next: () => {
        alert("Username updated!");
        this.newUsername = '';
      },
      error: err => alert("Error updating username: " + err.error?.error)
    });
  }

  // ===============================
  // 🔹 CHANGE EMAIL
  // ===============================
  changeEmail() {
    if (!this.newEmail.trim()) return alert("Enter a new email");

    this.http.patch(
      `${this.apiUrl}/update-email`,
      { email: this.newEmail },
      { headers: this.getAuthHeader() }
    ).subscribe({
      next: () => {
        alert("Email updated! Please log in again.");
        this.logout();
      },
      error: err => alert("Error updating email: " + err.error?.error)
    });
  }

  // ===============================
  // 🔹 CHANGE PASSWORD
  // ===============================
  changePassword() {
    if (!this.oldPassword || !this.newPassword)
      return alert("Fill both fields");

    this.http.patch(
      `${this.apiUrl}/update-password`,
      { oldPassword: this.oldPassword, newPassword: this.newPassword },
      { headers: this.getAuthHeader() }
    ).subscribe({
      next: () => {
        alert("Password updated! Please log in again.");
        this.logout();
      },
      error: err => alert("Error updating password: " + err.error?.error)
    });
  }

  // ===============================
  // 🔹 LOGOUT
  // ===============================
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  // ===============================
  // 🔹 AUTH HEADER
  // ===============================
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`
    };
  }
}
