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

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn()
  chat_id: number;

  @Column()
  user_id: number;

  @Column()
  team_id: number;

  @Column({ type: 'varchar' })
  message: string;

  @ManyToOne(() => Chat, { nullable: true })
  @JoinColumn({ name: 'reply_to', referencedColumnName: 'chat_id' })
  reply_to: Chat;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Team, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;
}
