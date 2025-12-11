import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class StudySession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  subject: string;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column({ nullable: true })
  notes: string;
}
