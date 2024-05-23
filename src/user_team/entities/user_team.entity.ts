import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Team } from 'src/team/entities/team.entity';

@Entity('user_teams')
export class UserTeam {
  @PrimaryGeneratedColumn()
  user_team_id: number;

  @Column()
  user_id: number;

  @Column()
  team_id: number;

  @Column({ type: 'varchar' })
  role: string;

  @CreateDateColumn({ type: 'timestamp' })
  joined_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Team, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'team_id' })
  team: Team;
}
