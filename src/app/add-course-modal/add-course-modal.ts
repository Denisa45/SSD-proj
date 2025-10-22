import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-course-modal',
  standalone: true,
  templateUrl: './add-course-modal.component.html',
  styleUrls: ['./add-course-modal.css']
})
class AddCourseModalComponent {
  constructor(public dialogRef: MatDialogRef<AddCourseModalComponent>) {}

  close() {
    this.dialogRef.close();
  }
}

export default AddCourseModalComponent;