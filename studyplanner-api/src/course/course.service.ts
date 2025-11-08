import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  findAllByUser(userId: number) {
    return this.courseRepo.find({ where: { userId } });
  }

  create(courseData: Partial<Course>) {
    return this.courseRepo.save(this.courseRepo.create(courseData));
  }

  delete(id: number, userId: number) {
    return this.courseRepo.delete({ id, userId });
  }
}
