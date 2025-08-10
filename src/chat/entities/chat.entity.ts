import { Team } from 'src/team/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn()
  chat_id: number;

  @Column()
  user_id: number;

  @Column()
  team_id: number;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', nullable: false })
  iv: string;

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
