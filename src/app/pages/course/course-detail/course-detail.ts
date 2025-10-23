import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Firestore, doc, docData, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './course-detail.html',
  styleUrls: ['./course-detail.css']
})
export class CourseDetailComponent implements OnInit {
  firestore = inject(Firestore);
  route = inject(ActivatedRoute);

  courseId!: string;         // ✅ definite assignment
  course$!: Observable<any>; // ✅ definite assignment
  newTask = '';

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.courseId = this.route.snapshot.params['id'];

    const courseDoc = doc(this.firestore, `users/${user.uid}/courses/${this.courseId}`);
    this.course$ = docData(courseDoc); // observable for course details
  }

  async addTask() {
    if (!this.newTask) return;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const courseDoc = doc(this.firestore, `users/${user.uid}/courses/${this.courseId}`);
    await updateDoc(courseDoc, {
      tasks: arrayUnion({ name: this.newTask, done: false })
    });
    this.newTask = '';
  }
}
