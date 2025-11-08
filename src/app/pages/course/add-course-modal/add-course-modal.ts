import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service'; // ✅ connect to backend

@Component({
  selector: 'app-add-course-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './add-course-modal.component.html',
  styleUrls: ['./add-course-modal.css']
})
export class AddCourseModalComponent {
  courseName = '';
  courseDescription = '';

  constructor(
    public dialogRef: MatDialogRef<AddCourseModalComponent>,
    private api: ApiService
  ) {}

  close() {
    this.dialogRef.close();
  }

  addCourse() {
    if (!this.courseName.trim()) {
      alert('Please enter a course name.');
      return;
    }

    const courseData = {
      name: this.courseName,
      description: this.courseDescription
    };

    this.api.addCourse(courseData).subscribe({
      next: () => {
        alert('✅ Course added successfully!');
        this.dialogRef.close('added'); // ✅ closes modal after save
      },
      error: (err) => {
        console.error('❌ Failed to add course:', err);
        alert(err.error?.message || 'Failed to add course.');
      }
    });
  }
}
