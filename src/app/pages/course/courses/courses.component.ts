import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCourseModalComponent } from '../add-course-modal/add-course-modal.component';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    AddCourseModalComponent,
    RouterModule
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  courses: any[] = [];

  constructor(
    private api: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.api.getCourses().subscribe(res => {
      this.courses = res;
    });
  }

  openAddCourseModal() {
    const dialogRef = this.dialog.open(AddCourseModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'added') {
        this.loadCourses();   // Refresh list
      }
    });
  }
}
