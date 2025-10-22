import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import AddCourseModalComponent from '../../add-course-modal/add-course-modal';
import {of, Observable } from 'rxjs';
import { Firestore,collection,collectionData } from '@angular/fire/firestore';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatDialogModule], // ✅ added MatDialogModule
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  user: any = null;
  activeTab: string='home';
  courses$: Observable<any[]> = of([]);
  
    constructor(
    private authService: AuthService,
    private dialog: MatDialog,            // ✅ injected here
    private firestore:Firestore
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);

    // 🔹 Load courses from Firestore
    const coursesCollection = collection(this.firestore, 'courses');
    this.courses$ = collectionData(coursesCollection, { idField: 'id' });
    }
  }

  // 🔹 Handle tab switching
  setActiveTab(tab: string) {
    this.activeTab = tab;
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
