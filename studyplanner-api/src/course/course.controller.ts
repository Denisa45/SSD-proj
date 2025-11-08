import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import { CourseService } from './course.service';
import { Course } from './course.entity';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(private readonly service: CourseService) {}

  @Get()
  getAll(@Req() req: any): Promise<Course[]> {
    const user = req.user;
    return this.service.findAllByUser(user.sub);
  }

  @Post()
  create(@Req() req: any, @Body() body: Partial<Course>) {
    const user = req.user;
    return this.service.create({ ...body, userId: user.sub });
  }

  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: number) {
    const user = req.user;
    return this.service.delete(id, user.sub);
  }

}
