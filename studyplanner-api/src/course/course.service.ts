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
    private readonly courseRepo: Repository<Course>,
  ) {}

  findAllByUser(userId: number) {
    return this.courseRepo.find({ where: { userId } });
  }

  async create(courseData: Partial<Course>, userId:number) {
    const course=this.courseRepo.create({
      name:courseData.name!,
      description:courseData.description??'',
      userId,
      tasks:Array.isArray(courseData.tasks)? courseData.tasks:[],
    });

    return this.courseRepo.save(course);
  }

  delete(id: number, userId: number) {
    return this.courseRepo.delete({ id, userId });
  }

  async getCourseById(id:number,userId:number){
    return this.courseRepo.findOne({where:{id,userId}});
  }

  async addTask(courseId: number, userId: number, taskName: string) {
    const course = await this.getCourseById(courseId, userId);
    if (!course) throw new Error('Course not found');

    if (!Array.isArray(course.tasks)) {
      course.tasks = [];
    }

    course.tasks.push({ name: taskName, done: false });

    return this.courseRepo.save(course);
  }


  async toggleTask(courseId: number, userId: number, taskName: string) {
  const course = await this.getCourseById(courseId, userId);
  if (!course) throw new Error('Course not found');

  if (!Array.isArray(course.tasks)) return course;

  course.tasks = course.tasks.map((t) =>
    t.name === taskName ? { ...t, done: !t.done } : t
  );

  return this.courseRepo.save(course);
}


  async removeTask(courseId:number , userId:number,taskName:string){
    const course=await this.getCourseById(courseId,userId);
    if(!course) throw new Error('course not found');

    if(!Array.isArray(course.tasks)) course.tasks=[];

    course.tasks=course.tasks.filter(t=>t.name!==taskName);
    return this.courseRepo.save(course);
  }

  async updateCourse(courseId:number,userId:number,updates:Partial<Course>){
    const course=await this.getCourseById(courseId,userId);
    if(!course) throw new Error('course not found');

    Object.assign(course,updates);
    return this.courseRepo.save(course);
  }

  async addMaterial(courseId:number, userId:number, filename:string){
    const course=await this.getCourseById(courseId,userId);
    if(!course) throw new Error('course not find');

    const fileUrl=`uploads/materials/${filename}`;
    course.materials=Array.isArray(course.materials)?
          [...course.materials,{name:filename,url:fileUrl}]
          : [{name:filename,url:fileUrl}];

    return this.courseRepo.save(course);
  }
  async removeMaterial(courseId: number, userId: number, fileName: string) {
  const course = await this.getCourseById(courseId, userId);
  if (!course) throw new Error('Course not found');

  if (!Array.isArray(course.materials)) course.materials = [];

  course.materials = course.materials.filter((m: any) => m.name !== fileName);

   const filePath = path.join(__dirname, '..', '..', 'uploads', 'materials', fileName);
   if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  return this.courseRepo.save(course);
}


}   
