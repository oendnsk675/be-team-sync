import { Project } from 'src/project/entities/project.entity';
import { Team } from 'src/team/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn({ name: 'task_id' })
  taskId: number;

  @ManyToOne(() => Project, (project) => project.project_id)
  @Column({ name: 'project_id', type: 'integer' })
  projectId: number;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ name: 'start_at', type: 'timestamp', default: null })
  startAt: Date;

  @Column({ name: 'end_at', type: 'timestamp', default: null })
  endAt: Date;

  @CreateDateColumn({ name: 'assigned_at', type: 'timestamptz' })
  assignedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToMany(() => User, (user) => user.tasks)
  @JoinTable({
    name: 'task_assignees',
    joinColumn: { name: 'task_id', referencedColumnName: 'taskId' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'user_id' },
  })
  assignees: User[];
}
