import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    type: String,
    example: 'johndoe01',
  })
  username: string;

  @ApiProperty({
    type: String,
    example: 'test@example.com',
  })
  email: string | null;

  @ApiProperty({
    type: String,
    example: 'John Doe',
  })
  name: string | null;

  @ApiProperty({
    type: String,
    example: 'user',
  })
  role: string;

  @ApiProperty({
    type: String,
    example: '/profiles/index.png',
  })
  imgUrl: string | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
