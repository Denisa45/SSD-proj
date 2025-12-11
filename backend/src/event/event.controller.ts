import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from './event.entity';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Post()
  create(@Body() event: Event) {
    console.log('Backend received event:', event); // 🔍 Log to see if data arrives
    return this.eventService.create(event);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() event: Event) {
    return this.eventService.update(+id, event);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
