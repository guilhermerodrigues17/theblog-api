import { User } from '../entities/user.entity';
import { UserResponseDto } from './user-response.dto';

export class UpdateUserResponseDto extends UserResponseDto {
  readonly updatedAt: Date;

  constructor(user: User) {
    super(user);
    this.updatedAt = user.updatedAt;
  }
}
