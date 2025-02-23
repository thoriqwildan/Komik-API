/* eslint-disable @typescript-eslint/no-unsafe-return */
import { IsNotEmpty } from 'class-validator';
import { SeriesType } from '../enum/type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateSeriesDto {
  @ApiProperty({ example: 'Solo Leveling', type: String })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Na Honjaman Level-Up, Only I Level Up, Ore Dake Level Up na Ken',
    type: String,
  })
  alternative?: string;

  @ApiProperty({
    example:
      'Manhwa Solo Leveling yang dibuat oleh komikus bernama Chugong 추공 ini bercerita tentang 10 tahun yang lalu, setelah “Gerbang” yang menghubungkan dunia nyata dengan dunia monster terbuka, beberapa orang biasa, setiap hari menerima kekuatan untuk berburu monster di dalam Gerbang.',
  })
  description?: string;

  @ApiProperty({
    example: 'manhwa',
    enum: SeriesType,
  })
  type: SeriesType;

  @ApiProperty({
    example: 'Ongoing',
  })
  status: string;

  @ApiProperty({
    example: '2018',
  })
  release: string;

  @ApiProperty({
    example: ['Chugong', 'h-goon', 'KI Soryeong'],
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  authors: string[];

  @ApiProperty({
    example: ['DUBU', 'Redice Studio'],
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  artists: string[];

  @ApiProperty({
    example: ['Action', 'Adventure', 'Drama', 'Fantasy', 'Mirror'],
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  genres: string[];

  file?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  cover?: any;
}
