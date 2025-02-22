/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthRegisterDto {
  @ApiProperty({ example: 'johndoe01', type: String })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'test@example.com', type: String })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe', type: String })
  @IsString()
  name: string;

  @ApiProperty()
  @MinLength(4)
  password: string;
}
