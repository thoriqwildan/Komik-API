import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class DeleteChapterDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  series_id?: number;

  @ApiProperty({ example: 1, description: 'Chapter Number', type: Number })
  @Type(() => Number)
  @IsInt()
  chapter_number: number;
}
