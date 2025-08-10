import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { encryptGCKWithPublicKey } from 'src/common/utils/crypto';
import { TeamRepository } from 'src/team/team.repository';
import { UserRepository } from 'src/user/user.repository';
import {
  CreateUserTeamDto,
  CreateUserTeamsDto,
} from './dto/create-user_team.dto';
import { RemoveUserTeamDto } from './dto/remove-user_team.dto';
import { UserTeamRepository } from './user_team.repository';

@Injectable()
export class UserTeamService {
  constructor(
    private readonly repository: UserTeamRepository,
    private readonly teamRepository: TeamRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createBulk(payload: CreateUserTeamsDto) {
    try {
      const team = await this.repository.findOne({
        where: {
          team_id: payload.teams[0].team_id,
          user_id: payload.teams[0].user_id,
        },
      });

      return await this.repository.createUserTeam(payload);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async create(payload: CreateUserTeamDto) {
    try {
      let team = await this.repository.findOne({
        where: {
          team_id: payload.team_id,
          user_id: payload.user_id,
        },
      });

      const gck = await this.teamRepository
        .findOneBy({ team_id: payload.team_id })
        .then((team) => team.gck);
      const buffer = Buffer.from(gck, 'base64');
      // console.table({
      //   'AES length (byte)': buffer.length,
      //   'AES length (bit)': buffer.length * 8,
      // });

      const publicKey = await this.userRepository
        .findOneBy({ user_id: payload.user_id })
        .then((user) => user.public_key);
      const encrypted_gck = await encryptGCKWithPublicKey(buffer, publicKey);

      const keyObject = crypto.createPublicKey(publicKey);
      // console.table({
      //   'RSA key public length': keyObject.asymmetricKeyDetails?.modulusLength,
      // });

      if (team) {
        team.encrypted_gck = encrypted_gck;
        const updated = await this.repository.save(team);
        return {
          data: updated,
          message: 'Encrypted GCK updated for existing user in team',
        };
      }

      team = this.repository.create({
        ...payload,
        encrypted_gck,
      });

      let result = await this.repository.save(team);

      return { data: result, message: 'Successfully add user' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async remove(payload: RemoveUserTeamDto) {
    return await this.repository.removeUserTeam(payload);
  }
}
