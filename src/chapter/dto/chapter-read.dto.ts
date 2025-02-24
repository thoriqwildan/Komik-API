import { ApiProperty } from '@nestjs/swagger';
import { WebResponseDto } from 'src/config/dto/web-response.dto';

export class ChapterReadDto<T> extends WebResponseDto<T> {
  @ApiProperty({ type: Boolean })
  previous: boolean;

  @ApiProperty({ type: Boolean })
  next: boolean;
}
