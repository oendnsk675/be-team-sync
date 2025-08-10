import { Task } from 'src/task/entities/task.entity';
import { UserTeam } from 'src/user_team/entities/user_team.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  team_id: number;

  @Column({ type: 'varchar' })
  team_name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @OneToMany(() => UserTeam, (userTeam) => userTeam.team)
  userTeams: UserTeam[];

  @Column({ type: 'text', nullable: false })
  gck: string;

  @OneToMany(() => Task, (task) => task.taskId)
  tasks: Task[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
