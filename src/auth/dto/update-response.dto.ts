import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/domain/user';

export class UpdateResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty({
    type: User,
  })
  user: User;
}
