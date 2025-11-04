import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

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
    public dialogRef: MatDialogRef<AddCourseModalComponent>, // ✅ must be public
    private firestore: Firestore
  ) {}

  close() {
    this.dialogRef.close();
  }

  async addCourse() {
    if (!this.courseName) return;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.uid) return;

    const coursesCollection = collection(this.firestore, `users/${user.uid}/courses`);

    try {
      await addDoc(coursesCollection, {
        name: this.courseName,
        description: this.courseDescription,
        createdAt: new Date()
      });

      // Close the modal and send 'added' result
      this.dialogRef.close('added');

    } catch (err) {
      console.error('Failed to add course:', err);
    }
  }
}
