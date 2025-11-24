import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-course-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-course-modal.component.html',
  styleUrls: ['./add-course-modal.css']
})
export class AddCourseModalComponent {
  name = '';
  description = '';

  constructor(
    private api: ApiService,
    private dialogRef: MatDialogRef<AddCourseModalComponent>
  ) {}

  addCourse() {
    if (!this.name.trim()) {
      alert("Course name is required");
      return;
    }

    this.api.addCourse({ name: this.name, description: this.description })
      .subscribe({
        next: () => {
          // Notify parent that a course was added
          this.dialogRef.close('added');
        },
        error: () => alert("Failed to add course")
      });
  }

  cancel() {
    this.dialogRef.close();
  }
}
