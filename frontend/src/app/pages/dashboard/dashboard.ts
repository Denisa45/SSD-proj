import { jwtDecode } from 'jwt-decode';
import { PlannerComponent } from '../planner/planner.component';

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddCourseModalComponent } from '../course/add-course-modal/add-course-modal.component';

import { ApiService } from '../../services/api.service';
import { LucideAngularModule } from 'lucide-angular';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    LucideAngularModule,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  user: any = null;
  courses: any[] = [];

   // Quick stats
bestCourse: string = '-';
bestAvg: number = 0;

worstCourse: string = '-';
worstAvg: number = 0;

totalCourses: number = 0;
totalCompletedTasks: number = 0;

upcomingEventsToday: number = 0;


  //Global average
  globalAverage: number = 0;

  @ViewChild(PlannerComponent) planner!: PlannerComponent;

  constructor(
    private authService: AuthService,
    private api: ApiService,
    private events: EventService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    // 🔐 Get user from token
    const token = localStorage.getItem('token');
    const firebaseUser = localStorage.getItem('user');

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.user = { username: decoded.username || 'User' };

        // Load courses after login
        this.loadCourses();

      } catch (e) {
        console.error('Failed to decode token', e);
      }
    } 
    else if (firebaseUser) {
      this.user = JSON.parse(firebaseUser);
    }

    // 🔍 Check URL fragments (#addCourse, #addEvent)
    this.route.fragment.subscribe(f => {
      if (f === 'addCourse') this.openAddCourseModal();
      //if (f === 'addEvent') this.openAddEventModal();
    });
  }


  // ============================================================
  // 🔹 COURSES
  // ============================================================
  loadCourses() {
    this.api.getCourses().subscribe({
      next: (data) => {
        console.log('Courses loaded:', data);
        this.courses = data;
        this.totalCourses = this.courses.length;
        this.calculateStats();
        this.calculateGlobalAverage();


        //  Compute global grade average
        this.calculateGlobalAverage();
      },
      error: (err) => {
        console.error('Failed to load courses:', err);
      },
    });
  }


  calculateGlobalAverage() {
    let total = 0;
    let count = 0;

    for (const course of this.courses) {
      if (course.grades && Array.isArray(course.grades)) {
        for (const g of course.grades) {
          total += Number(g.value);
          count++;
        }
      }
    }

    this.globalAverage = count === 0 ? 0 : Number((total / count).toFixed(2));
  }


  openAddCourseModal() {
    const dialogRef = this.dialog.open(AddCourseModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'added') {
        this.loadCourses(); 
      }
    });
  }


  // ============================================================
  // 🔹 EVENTS
  // ============================================================
/*   openAddEventModal() {
    const title = prompt('Enter event title:');
    const date = prompt('Enter event date (YYYY-MM-DD):');

    if (title && date && this.planner) {
      this.planner.addEvent(title, date);
    }
  }
 */

  // ============================================================
  // 🔹 LOGOUT
  // ============================================================
  logout() {
    this.authService.logout().catch(err => console.warn(err));
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }


  calculateStats() {
  // --- Compute best & worst course average ---
  let best = { name: '-', avg: 0 };
  let worst = { name: '-', avg: 11 }; // grades are 1-10

  let totalCompleted = 0;

  for (const c of this.courses) {
    // Compute course average
    let avg = 0;

    if (c.grades && c.grades.length > 0) {
      const sum = c.grades.reduce((a: number, g: any) => a + Number(g.value), 0);
      avg = sum / c.grades.length;

      if (avg > best.avg) best = { name: c.name, avg };
      if (avg < worst.avg) worst = { name: c.name, avg };
    }

    // Count completed tasks
    if (c.tasks && Array.isArray(c.tasks)) {
      totalCompleted += c.tasks.filter((t: any) => t.done).length;
    }
  }

  this.bestCourse = best.name;
  this.bestAvg = Number(best.avg.toFixed(2));

  this.worstCourse = worst.name === '-' ? '-' : worst.name;
  this.worstAvg = worst.avg === 11 ? 0 : Number(worst.avg.toFixed(2));

  this.totalCompletedTasks = totalCompleted;

  // --- Count today's events ---
  const today = new Date().toISOString().split('T')[0];
  this.events.getEvents().subscribe(ev => {
    this.upcomingEventsToday = ev.filter((e: any) => e.date === today).length;
  });
}

}
