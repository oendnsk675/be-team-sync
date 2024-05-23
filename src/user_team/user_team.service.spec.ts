import { Test, TestingModule } from '@nestjs/testing';
import { UserTeamService } from './user_team.service';

describe('UserTeamService', () => {
  let service: UserTeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTeamService],
    }).compile();

    service = module.get<UserTeamService>(UserTeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
