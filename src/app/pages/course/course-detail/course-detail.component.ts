import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {

  courseId!: string;
  course: any = null;
  newTask = '';
  newGrade: number | null = null;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['id'];
    this.loadCourse();
  }

  loadCourse() {
    this.api.getCourseById(this.courseId).subscribe({
      next: (data) => this.course = data,
      error: (err) => console.error("❌ Error loading course", err)
    });
  }


  // --------------------------
  // 🔹 TASK ACTIONS
  // --------------------------

  addTask() {
    if (!this.newTask.trim()) return;

    this.api.addTaskCourse(this.courseId, this.newTask).subscribe({
      next: (updated) => {
        this.course = updated;
        this.newTask = '';
      },
      error: (err) => console.error('❌ Error adding task', err),
    });
  }

  toggleTask(taskName: string) {
    this.api.toggleTaskCourse(this.courseId, encodeURIComponent(taskName)).subscribe({
      next: (updated) => this.course = updated,
      error: (err) => console.error('❌ Error toggling task', err),
    });
  }

  removeTask(taskName: string) {
    this.api.removeTask(this.courseId, taskName).subscribe({
      next: (updated) => this.course = updated,
      error: (err) => console.error('❌ Error removing task', err),
    });
  }


  // --------------------------
  // 🔹 GRADE ACTIONS
  // --------------------------

  addGrade() {
    if (this.newGrade == null || this.newGrade < 1 || this.newGrade > 10) return;

    this.api.addGrade(this.courseId, this.newGrade).subscribe({
      next: (updated) => {
        this.course = updated;
        this.newGrade = null;
      },
      error: err => console.error("❌ Error adding grade", err)
    });
  }

  removeGrade(index: number) {
    this.api.removeGrade(this.courseId, index).subscribe({
      next: (updated) => this.course = updated,
      error: err => console.error("❌ Error removing grade", err)
    });
  }


  // --------------------------
  // 🔹 PROGRESS COUNTERS
  // --------------------------

  get completedTasksCount(): number {
    return this.course?.tasks?.filter((t: any) => t.done).length || 0;
  }

  get totalTasksCount(): number {
    return this.course?.tasks?.length || 0;
  }


  // --------------------------
  // 🔹 EDIT / DELETE COURSE
  // --------------------------

  editCourse() {
    const newName = prompt('Enter new course name:', this.course.name);
    const newDesc = prompt('Enter new description:', this.course.description);

    if (newName) {
      this.api.updateCourse(this.courseId, { name: newName, description: newDesc }).subscribe({
        next: (updated) => this.course = updated,
        error: err => console.error("❌ Error updating course", err)
      });
    }
  }

  deleteCourse() {
    if (!confirm('Are you sure you want to delete this course?')) return;

    this.api.deleteCourse(this.courseId).subscribe({
      next: () => window.location.href = '/dashboard',
      error: err => console.error("❌ Error deleting course", err)
    });
  }


  // --------------------------
  // 🔹 MATERIALS
  // --------------------------

  uploadMaterial(files: FileList | null) {
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.api.uploadMaterial(this.courseId, formData).subscribe({
      next: (updated) => this.course = updated,
      error: err => console.error("❌ Error uploading file", err)
    });
  }

  removeMaterial(materialName: string) {
    if (!confirm(`Delete material "${materialName}"?`)) return;

    this.api.removeMaterial(this.courseId, materialName).subscribe({
      next: updated => this.course = updated,
      error: err => console.error("❌ Error removing material", err)
    });
  }


  // --------------------------
  // 🔹 GRADE AVERAGE
  // --------------------------

  get gradeAverage(): number {
    if (!this.course?.grades || this.course.grades.length === 0) return 0;

    const total = this.course.grades.reduce(
      (sum: number, g: any) => sum + g.value, 0
    );
    return parseFloat((total / this.course.grades.length).toFixed(2));
  }

}
