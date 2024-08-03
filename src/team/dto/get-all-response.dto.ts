import { Team } from '../entities/team.entity';

export class GetAllResponse {
  message: string;
  data: {
    data: Team[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
