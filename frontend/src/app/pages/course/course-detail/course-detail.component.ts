import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CourseService, Course } from '../../../services/course.service'; 
// ^ Make sure this path points to your CourseService

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
})
export class CourseDetailComponent implements OnInit {

  courseId!: number;
  course: Course | null = null;
  selectedFile: File | null = null;
  
  // This helper is used in the HTML to prefix image URLs
  backendUrl = 'http://localhost:3000/';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService 
  ) {}

  ngOnInit(): void {
    // Ensure ID is a number
    this.courseId = Number(this.route.snapshot.params['id']);
    this.loadCourse();
  }

  loadCourse() {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (data) => this.course = data,
      error: (err) => console.error("❌ Error loading course", err)
    });
  }

  // --------------------------
  // 🔹 EDIT / DELETE COURSE (Fixed Errors 1 & 2)
  // --------------------------

  editCourse() {
    // Simple prompt for now. You can replace this with a proper form later.
    if (!this.course) return;

    const newName = prompt('Enter new course name:', this.course.name);
    const newDesc = prompt('Enter new description:', this.course.description);

    if (newName) {
       // Note: We need to ensure updateCourse exists in your service, 
       // but this logic allows the button to exist without crashing.
       // For now, we just log it until you add the update method.
       console.log('Update requested:', newName, newDesc);
       alert('Edit feature requires updateCourse method in service.');
    }
  }

  deleteCourse() {
    if (!confirm('Are you sure you want to delete this course?')) return;

    // Note: Ensure deleteCourse exists in your service!
    // If it doesn't exist yet, this will cause a compile error.
    // I've added a basic implementation below assuming the service has it.
    // If your service is missing it, comment this out for now.
    
    this.courseService.deleteCourse(this.courseId).subscribe({
       next: () => this.router.navigate(['/courses']),
       error: (err) => alert('Error deleting course')
    });
    alert('Delete button clicked (Functionality requires service update)');
  }

  // --------------------------
  // 🔹 TASK ACTIONS (Fixed Error 3)
  // --------------------------

  // Updated to accept the taskName string from HTML
  addTask(taskName: string) {
    if (!taskName.trim()) return;

    this.courseService.addTask(this.courseId, taskName).subscribe({
      next: () => {
        this.loadCourse(); // Reload data to show new task
      },
      error: (err) => console.error('❌ Error adding task', err),
    });
  }

  toggleTask(taskName: string) {
    this.courseService.toggleTask(this.courseId, taskName).subscribe({
      next: () => this.loadCourse(),
      error: (err) => console.error('❌ Error toggling task', err),
    });
  }

  removeTask(taskName: string) {
    this.courseService.removeTask(this.courseId, taskName).subscribe({
      next: () => this.loadCourse(),
      error: (err) => console.error('❌ Error removing task', err),
    });
  }

  // --------------------------
  // 🔹 GRADE ACTIONS (Fixed Errors 4 & 5)
  // --------------------------

  // Updated to accept arguments from HTML inputs
  addGrade(name: string, scoreStr: string) {
    if (!name || !scoreStr) {
      alert("Please enter both a name and a score.");
      return;
    }
    
    const score = parseFloat(scoreStr);

    this.courseService.addGrade(this.courseId, score, name).subscribe({
      next: () => this.loadCourse(),
      error: err => console.error("❌ Error adding grade", err)
    });
  }

  removeGrade(gradeName: string) {
    if (!confirm(`Are you sure you want to delete the grade "${gradeName}"?`)) {
      return;
    }

    this.courseService.removeGrade(this.courseId, gradeName).subscribe({
      next: () => {
        this.loadCourse();
      },
      // 👇 CHANGE THIS LINE
      error: (err: any) => {  
        console.error('❌ Error deleting grade', err);
        alert('Failed to delete grade.');
      }
    });
  }

  // Renamed from 'get gradeAverage' to 'getAverageGrade()' to match HTML
  getAverageGrade(): number {
    if (!this.course?.grades || this.course.grades.length === 0) return 0;

    const total = this.course.grades.reduce(
      (sum: number, g: any) => sum + Number(g.score), 0
    );
    return parseFloat((total / this.course.grades.length).toFixed(2));
  }

  // --------------------------
  // 🔹 MATERIALS
  // --------------------------

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  uploadFile() {
    if (this.courseId && this.selectedFile) {
      this.courseService.uploadCourseFile(this.courseId, this.selectedFile).subscribe({
        next: (res) => {
          alert('File uploaded!');
          this.selectedFile = null;
          this.loadCourse();
        },
        error: (err) => alert('Upload failed.')
      });
    } else {
      alert('Please select a file first.');
    }
  }

  removeMaterial(fileName: string) {
    if (!confirm(`Delete ${fileName}?`)) return;
    
    this.courseService.removeMaterial(this.courseId, fileName).subscribe({
        next: () => this.loadCourse(),
        error: (err) => console.error(err)
    });
  }
}