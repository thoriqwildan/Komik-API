/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { WebResponseDto } from 'src/config/dto/web-response.dto';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get(':id/series')
  async getSeries(
    @Param('id', ParseIntPipe) artist_id: number,
  ): Promise<WebResponseDto<any>> {
    return {
      status: 'success',
      message: 'Get Series Data Successfully',
      data: await this.artistService.getSeries(artist_id),
    };
  }
}
