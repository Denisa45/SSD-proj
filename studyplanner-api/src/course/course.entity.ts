import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
type TaskItem={name:string; done:boolean};

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;



  @Column()
  userId: number; // which user owns the course

  @Column({ type: 'json', default: [] })
  tasks: TaskItem[];

  @Column({ type: 'json', default: [] })
  materials: { name: string; url: string }[];



}
