import { ApiProperty } from '@nestjs/swagger';
import { WebResponseDto } from './web-response.dto';

export class PaginationResponseDto<T> extends WebResponseDto<T> {
  @ApiProperty({ description: 'Total data' })
  total: number;

  @ApiProperty({ description: 'Current Page' })
  page: number;

  @ApiProperty({ description: 'Items per Page' })
  limit: number;

  @ApiProperty({ description: 'Total Pages' })
  totalPages: number;
}
