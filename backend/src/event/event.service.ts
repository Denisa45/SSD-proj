import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  findAll(): Promise<Event[]> {
    return this.eventsRepository.find();
  }

  findOne(id: number): Promise<Event | null> {
    return this.eventsRepository.findOneBy({ id });
  }

  create(event: Partial<Event>): Promise<Event> {
    const newEvent = this.eventsRepository.create(event);
    return this.eventsRepository.save(newEvent);
  }

  // Inside EventService class
  async update(id: number, eventData: Partial<Event>): Promise<Event> {
    await this.eventsRepository.update(id, eventData);
    return this.eventsRepository.findOneByOrFail({ id });
  }

  async remove(id: number): Promise<void> {
    await this.eventsRepository.delete(id);
  }
}
