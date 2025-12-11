import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleItem } from './schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleItem)
    private repo: Repository<ScheduleItem>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  // This saves or updates a slot based on Day + Time
  async saveSlot(
    day: string,
    startTime: string,
    subject: string,
    room: string,
  ) {
    // Check if a class already exists at this time
    const existing = await this.repo.findOneBy({ day, startTime });

    if (existing) {
      // Update existing class
      existing.subject = subject;
      existing.room = room;
      return this.repo.save(existing);
    } else {
      // Create new class
      const newItem = this.repo.create({ day, startTime, subject, room });
      return this.repo.save(newItem);
    }
  }

  // Clear a specific slot
  async clearSlot(day: string, startTime: string) {
    const existing = await this.repo.findOneBy({ day, startTime });
    if (existing) {
      return this.repo.remove(existing);
    }
  }
}
