import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('schedule_items')
export class ScheduleItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day: string; // e.g., "Monday", "Tuesday"

  @Column()
  startTime: string; // e.g., "08:00", "10:00"

  @Column()
  subject: string; // e.g., "Math", "Computer Science"

  @Column({ default: '' })
  room: string; // e.g., "Room 301" (Optional)
}
