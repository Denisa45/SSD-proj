import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('study_sessions')
export class StudySession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column()
  duration: number; // minutes

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ nullable: true })
  notes: string;
}
