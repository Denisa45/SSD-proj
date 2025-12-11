import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>, // <--- This fixes 'courseRepo does not exist'
  ) {}

  findAllByUser(userId: number) {
    return this.courseRepo.find({ where: { userId } });
  }

  async getCourseById(id: number, userId: number) {
    return this.courseRepo.findOne({ where: { id, userId } });
  }

  async create(courseData: Partial<Course>, userId: number) {
    const course = this.courseRepo.create({
      name: courseData.name!,
      description: courseData.description ?? '',
      userId,
      tasks: Array.isArray(courseData.tasks) ? courseData.tasks : [],
    });
    return this.courseRepo.save(course);
  }

  delete(id: number, userId: number) {
    return this.courseRepo.delete({ id, userId });
  }

  async updateCourse(
    courseId: number,
    userId: number,
    updates: Partial<Course>,
  ) {
    const course = await this.getCourseById(courseId, userId);
    if (!course) throw new Error('course not found');
    Object.assign(course, updates);
    return this.courseRepo.save(course);
  }

  // --- TASKS ---
  async addTask(courseId: number, userId: number, taskName: string) {
    const course = await this.getCourseById(courseId, userId);
    if (!course) throw new Error('Course not found');
    if (!Array.isArray(course.tasks)) course.tasks = [];

    // Explicitly cast to prevent "unsafe access"
    const tasks = course.tasks as { name: string; done: boolean }[];
    tasks.push({ name: taskName, done: false });

    course.tasks = tasks;
    return this.courseRepo.save(course);
  }

  async toggleTask(courseId: number, userId: number, taskName: string) {
    const course = await this.getCourseById(courseId, userId);
    if (!course) throw new Error('Course not found');
    if (Array.isArray(course.tasks)) {
      const tasks = course.tasks as { name: string; done: boolean }[];
      course.tasks = tasks.map((t) =>
        t.name === taskName ? { ...t, done: !t.done } : t,
      );
    }
    return this.courseRepo.save(course);
  }

  async removeTask(courseId: number, userId: number, taskName: string) {
    const course = await this.getCourseById(courseId, userId);
    if (!course) throw new Error('Course not found');
    if (Array.isArray(course.tasks)) {
      const tasks = course.tasks as { name: string; done: boolean }[];
      course.tasks = tasks.filter((t) => t.name !== taskName);
    }
    return this.courseRepo.save(course);
  }

  // --- MATERIALS ---
  async addMaterial(courseId: number, userId: number, filename: string) {
    const course = await this.getCourseById(courseId, userId);
    if (!course) throw new Error('course not found');

    const fileUrl = `uploads/materials/${filename}`;
    const newMaterial = { name: filename, url: fileUrl };

    if (!Array.isArray(course.materials)) course.materials = [];

    const mats = course.materials as { name: string; url: string }[];
    mats.push(newMaterial);
    course.materials = mats;

    return this.courseRepo.save(course);
  }

  async removeMaterial(courseId: number, userId: number, fileName: string) {
    const course = await this.getCourseById(courseId, userId);
    if (!course) throw new Error('Course not found');

    if (Array.isArray(course.materials)) {
      const mats = course.materials as { name: string; url: string }[];
      course.materials = mats.filter((m) => m.name !== fileName);
    }

    const filePath = path.join(process.cwd(), 'uploads', 'materials', fileName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return this.courseRepo.save(course);
  }

  // --- GRADES (The Missing Part) ---
  async addGrade(
    courseId: number,
    userId: number,
    grade: { name: string; score: number },
  ) {
    const course = await this.getCourseById(courseId, userId);
    if (!course) throw new Error('Course not found');

    if (!Array.isArray(course.grades)) course.grades = [];
    const grades = course.grades as { name: string; score: number }[];
    grades.push(grade);
    course.grades = grades;

    return this.courseRepo.save(course);
  }

  async removeGrade(courseId: number, userId: number, gradeName: string) {
    const course = await this.getCourseById(courseId, userId);
    if (!course) throw new Error('Course not found');

    if (Array.isArray(course.grades)) {
      const grades = course.grades as { name: string; score: number }[];
      course.grades = grades.filter((g) => g.name !== gradeName);
    }
    return this.courseRepo.save(course);
  }
}
