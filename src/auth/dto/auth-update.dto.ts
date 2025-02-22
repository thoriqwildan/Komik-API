/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthUpdateDto {
  @IsString()
  @ApiProperty({
    example: 'johndoe02',
    type: String,
  })
  username?: string;

  @IsString()
  @ApiProperty({
    example: 'Hooman',
    type: String,
  })
  name?: string;

  @IsString()
  @ApiProperty()
  password?: string;

  @IsString()
  @ApiProperty()
  confirm_password?: string;
}
