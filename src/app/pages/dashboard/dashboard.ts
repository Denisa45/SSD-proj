import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {AddCourseModalComponent} from '../course/add-course-modal/add-course-modal';
import {of, Observable } from 'rxjs';
import { Firestore,collection,collectionData } from '@angular/fire/firestore';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatDialogModule,RouterModule], // ✅ added MatDialogModule
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
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.uid) {
      const coursesCollection = collection(this.firestore, `users/${user.uid}/courses`);
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
  const dialogRef = this.dialog.open(AddCourseModalComponent, {
    width: '400px' // optional, makes modal a good size
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'added') {
      this.activeTab = 'courses'; // switch tab
      console.log('Course added!');
    }
  });
}



}
