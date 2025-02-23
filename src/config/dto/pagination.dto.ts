import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Page now', default: 1 })
  @Transform(({ value }) => Number(value) || 1)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per Page', default: 10 })
  @Transform(({ value }) => Number(value) || 10)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
