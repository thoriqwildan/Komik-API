import { ApiProperty } from '@nestjs/swagger';

export class WebResponseDto<T> {
  @ApiProperty({
    type: String,
    example: 'success',
  })
  status: string;

  @ApiProperty({
    type: String,
    example: 'Success message',
  })
  message: string;

  @ApiProperty()
  data: T;
}
