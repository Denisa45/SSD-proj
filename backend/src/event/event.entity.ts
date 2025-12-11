import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column() // Storing date as 'YYYY-MM-DD' string is safest for now
  date: string;

  @Column({ nullable: true })
  description: string;
}
