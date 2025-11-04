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
    // ✅ initialize user properly
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);

      // load courses from Firestore if logged in
      const coursesCollection = collection(this.firestore, `users/${this.user.uid}/courses`);
      this.courses$ = collectionData(coursesCollection, { idField: 'id' }) as Observable<any[]>;
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

  // sa se inchida explicit 

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'added') {
      this.activeTab = 'courses'; // switch tab
      console.log('Course added!');
    }
  });
}



}
