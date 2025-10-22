import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import AddCourseModalComponent from '../../add-course-modal/add-course-modal';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatDialogModule], // ✅ added MatDialogModule
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  user: any = null;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog            // ✅ injected here
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }

  logout() {
    this.authService.logout().catch((err: any) => console.warn('Firebase logout failed', err));
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  openAddCourseModal() {
    this.dialog.open(AddCourseModalComponent);  // ✅ now valid
  }
}
