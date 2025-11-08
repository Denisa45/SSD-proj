import { jwtDecode } from 'jwt-decode';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddCourseModalComponent } from '../course/add-course-modal/add-course-modal';
import { ApiService } from '../../services/api.service';
import { Observable, of } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    LucideAngularModule, // ✅ this is now valid
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  user: any = null;
  activeTab: string = 'home';
  courses: any[] = [];

  constructor(
    private authService: AuthService,
    private api: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const firebaseUser = localStorage.getItem('user');

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.user = { username: decoded.username || 'User' };
        this.loadCourses(); // ✅ Load courses from backend
      } catch (e) {
        console.error('Failed to decode token', e);
      }
    } else if (firebaseUser) {
      this.user = JSON.parse(firebaseUser);
      // optional: you can skip Firebase Firestore part for now
    }
  }

  // 🔹 Fetch courses from backend
  loadCourses() {
    this.api.getCourses().subscribe({
      next: (data) => {
        console.log('Courses loaded:', data);
        this.courses = data;
      },
      error: (err) => {
        console.error('Failed to load courses:', err);
      },
    });
  }

  logout() {
    this.authService.logout().catch((err: any) => console.warn('Firebase logout failed', err));
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  openAddCourseModal() {
    const dialogRef = this.dialog.open(AddCourseModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'added') {
        this.loadCourses(); // ✅ Refresh list after adding
      }
    });
  }

  setActiveTab(tab: string) {
  this.activeTab = tab;
    }

}
