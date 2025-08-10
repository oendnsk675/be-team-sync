import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserTeamRepository } from 'src/user_team/user_team.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

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

  async findAllUserForInvite(
    team_id: number,
    user_id: number,
    query?: string,
  ): Promise<any> {
    try {
      // get data user
      let users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.userTeams', 'userTeams')
        .where('userTeams.team_id IS NULL OR userTeams.team_id != :team_id', {
          team_id,
        })
        .andWhere('user.username LIKE :query', { query: `%${query}%` })
        .orWhere('user.fullname LIKE :query', { query: `%${query}%` })
        .orWhere('user.email LIKE :query', { query: `%${query}%` })
        .getMany();
      users = users.filter((user) => user.user_id !== user_id);
      // get team user
      const teams = await this.userTeamRepository.find({
        where: { team_id },
        relations: ['user'],
      });

      // Buat set untuk mempercepat pencarian user yang sudah diundang
      const invitedUserIds = new Set(teams.map((tu) => tu.user.user_id));

      // Tandai user dengan hasInvited jika mereka sudah join ke team
      users = users.map((user) => ({
        ...user,
        hasInvited: invitedUserIds.has(user.user_id), // Tambahkan flag hasInvited
      }));

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
    try {
      await this.userRepository.update({ user_id }, updateUserDto);
      return {
        message: 'Successfull update data user',
      };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async updateAvatar(userId: number, avatarFilename: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update avatar path in the database
    user.avatar = avatarFilename;
    await this.userRepository.save(user);

    return { message: 'Avatar updated successfully', data: user.avatar };
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

  async setPublicKey(userId: number, publicKey: string) {
    const user = await this.userRepository.findOneBy({ user_id: userId });
    if (!user) throw new NotFoundException('User not found');

    user.public_key = publicKey;
    await this.userRepository.save(user);
    return { message: 'Public key saved' };
  }

  async getPublicKey(userId: number) {
    const user = await this.userRepository.findOneBy({ user_id: userId });
    return user.public_key;
  }
}
