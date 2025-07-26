import { Visibility, StatusProject } from 'src/common/enums/projects';
import { Team } from 'src/team/entities/team.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  project_id: number;

  @Column({ type: 'varchar', length: 255 })
  project_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', default: 'public', enum: ['public', 'private'] })
  visibility?: Visibility;

  @Column({ type: 'enum', default: 'open', enum: ['open', 'close'] })
  status?: StatusProject;

  @ManyToOne(() => Team, (team) => team.team_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
