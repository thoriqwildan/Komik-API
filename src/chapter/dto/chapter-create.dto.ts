import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateChapterDto {
  @IsOptional()
  series_id?: number;

  @ApiProperty({ example: 'Menuju Ibukota', description: 'Chapter title' })
  @IsOptional()
  title?: string;

  @ApiProperty({ example: '1', description: 'Chapter number' })
  @IsNotEmpty()
  chapter: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  zipchapter?: Express.Multer.File;
}
