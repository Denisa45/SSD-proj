import { Controller, Get, Post, Body } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private service: ScheduleService) {}

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Post()
  saveSlot(
    @Body()
    body: {
      day: string;
      startTime: string;
      subject: string;
      room: string;
    },
  ) {
    if (!body.subject) {
      return this.service.clearSlot(body.day, body.startTime);
    }
    return this.service.saveSlot(
      body.day,
      body.startTime,
      body.subject,
      body.room,
    );
  }
}
