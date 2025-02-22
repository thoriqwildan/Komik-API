/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { lowerCaseTransformer } from 'src/config/utils/lower-case.transformer';

export class AuthLoginDto {
  @ApiProperty({ example: 'test@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
