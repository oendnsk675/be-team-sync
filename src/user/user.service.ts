import { BadGatewayException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserTeamRepository } from 'src/user_team/user_team.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userTeamRepository: UserTeamRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(query?: string): Promise<any> {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.username LIKE :query', { query: `%${query}%` })
        .orWhere('user.fullname LIKE :query', { query: `%${query}%` })
        .orWhere('user.email LIKE :query', { query: `%${query}%` })
        .getMany();
      return {
        message: 'Successfully retrieved data members',
        data: users,
      };
    } catch (error) {
      throw new BadGatewayException();
    }
  }

  async findAllUserForInvite(team_id: number, query?: string): Promise<any> {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.userTeams', 'userTeams')
        .where('userTeams.team_id IS NULL OR userTeams.team_id != :team_id', {
          team_id,
        })
        .andWhere('user.username LIKE :query', { query: `%${query}%` })
        .orWhere('user.fullname LIKE :query', { query: `%${query}%` })
        .orWhere('user.email LIKE :query', { query: `%${query}%` })
        .getMany();
      return {
        message: 'Successfully retrieved data members',
        data: users,
      };
    } catch (error) {
      throw new BadGatewayException();
    }
  }

  async findOne(user_id: number) {
    const user = await this.userRepository.findOne({ where: { user_id } });
    return {
      message: 'Successfull retrieve data user',
      data: user,
    };
  }

  async update(user_id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update({ user_id }, updateUserDto);
    return {
      message: 'Successfull update data user',
    };
  }

  async updateStatus(user_id: number, status: boolean) {
    try {
      await this.userRepository.update({ user_id }, { status });
    } catch (error) {
      throw new BadGatewayException();
    }
  }

  async findByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
