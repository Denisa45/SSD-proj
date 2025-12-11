import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Define the shape of a Grade
export type GradeItem = { name: string; score: number };
type TaskItem = { name: string; done: boolean };

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  userId: number;

  @Column({ type: 'json', default: [] })
  tasks: TaskItem[];

  @Column({ type: 'json', default: [] })
  materials: { name: string; url: string }[];

  // in course.entity.ts
  @Column({ type: 'json', default: [] })
  grades: { name: string; score: number }[];
}
