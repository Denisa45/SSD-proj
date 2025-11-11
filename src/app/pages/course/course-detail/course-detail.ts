import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Firestore, doc, docData, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './course-detail.html',
  styleUrls: ['./course-detail.css']
})
export class CourseDetailComponent implements OnInit {
  courseId!:number;
  course:any=null;
  newTask='';

  constructor(
    private api:ApiService,
    private route:ActivatedRoute
  ){}

  ngOnInit(): void {
      this.courseId=Number(this.route.snapshot.params['id']); // get the course if from the path of the course
      this.loadCourse();
  }

  loadCourse(){
    this.api.getCourseById(this.courseId).subscribe({
      next:(data)=>{
        console.log('loaded course: ',data);
        this.course=data;
      },
      error:(err)=>console.error('error loading the course',err),
      
    });
  }

    addTask() {
    if (!this.newTask.trim()) return;

    this.api.addTaskCourse(this.courseId, this.newTask).subscribe({
      next: (updatedCourse) => {
        console.log('✅ Task added:', updatedCourse);
        this.course = updatedCourse;
        this.newTask = '';
      },
      error: (err) => console.error('❌ Error adding task', err),
    });
  }

  toggleTask(taskName: string) {
    this.api.toggleTaskCourse(this.courseId, taskName).subscribe({
      next: (updatedCourse) => {
        console.log('✅ Task toggled:', updatedCourse);
        this.course = updatedCourse;
      },
      error: (err) => console.error('❌ Error toggling task', err),
    });
  }

    get completedTasksCount(): number {
    if (!this.course?.tasks) return 0;
    return this.course.tasks.filter((t: any) => t.done).length;
  }

  get totalTasksCount(): number {
    return this.course?.tasks?.length || 0;
  }

  removeTask(taskName: string) {
  if (!confirm(`Remove task "${taskName}"?`)) return;
  this.api.removeTask(this.courseId, taskName).subscribe({
    next: (updated) => (this.course = updated),
    error: (err) => console.error('Error removing task', err),
  });
}

editCourse() {
  const newName = prompt('Enter new course name:', this.course.name);
  const newDesc = prompt('Enter new description:', this.course.description);
  if (newName) {
    this.api.updateCourse(this.courseId, { name: newName, description: newDesc }).subscribe({
      next: (updated) => (this.course = updated),
      error: (err) => console.error('Error updating course', err),
    });
  }
}

deleteCourse() {
  if (!confirm('Are you sure you want to delete this course?')) return;
  this.api.deleteCourse(this.courseId).subscribe({
    next: () => {
      alert('Course deleted!');
      window.location.href = '/dashboard';
    },
    error: (err) => console.error('Error deleting course', err),
  });
}

selectedFile: File | null = null;

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
}


uploadMaterial(files: FileList | null) {
  if (!files || files.length === 0) return;

  const file = files[0];
  const formData = new FormData();
  formData.append('file', file);

  this.api.uploadMaterial(this.courseId, formData).subscribe({
    next: (updatedCourse) => {
      console.log('✅ File uploaded:', updatedCourse);
      this.course = updatedCourse;
    },
    error: (err) => console.error('❌ Error uploading file', err),
  });
}


removeMaterial(fileName: string) {
  if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return;
  this.api.removeMaterial(this.courseId, fileName).subscribe({
    next: (updatedCourse) => {
      console.log('🗑️ Material removed:', updatedCourse);
      this.course = updatedCourse;
    },
    error: (err) => console.error('❌ Error removing material', err),
  });
}






}
