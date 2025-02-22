/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { WebResponseDto } from 'src/config/dto/web-response.dto';
import { GenreService } from './genre.service';

@Controller('genre')
export class GenreController {
  constructor(private genreService: GenreService) {}

  @Get(':id/series')
  async getSeries(
    @Param('id', ParseIntPipe) genre_id: number,
  ): Promise<WebResponseDto<any>> {
    return {
      status: 'success',
      message: 'Get Series Data Successfully',
      data: await this.genreService.getSeries(genre_id),
    };
  }
}
