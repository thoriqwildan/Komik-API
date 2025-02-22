import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/domain/user';

export class AuthResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty({
    type: User,
  })
  user: User;
}
