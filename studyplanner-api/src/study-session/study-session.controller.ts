import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { StudySessionService } from './study-session.service';
import { StudySession } from './study-session.entity';

@Controller('study-sessions')
export class StudySessionController {
  constructor(private readonly service: StudySessionService) {}

  @Get()
  getAll(): Promise<StudySession[]> {
    return this.service.findAll();
  }

  @Post()
  create(@Body() session: Partial<StudySession>) {
    return this.service.create(session);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
