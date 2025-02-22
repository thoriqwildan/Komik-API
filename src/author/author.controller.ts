/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AuthorService } from './author.service';
import { WebResponseDto } from 'src/config/dto/web-response.dto';

@Controller('author')
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  @Get(':id/series')
  async getSeries(
    @Param('id', ParseIntPipe) author_id: number,
  ): Promise<WebResponseDto<any>> {
    return {
      status: 'success',
      message: 'Get Series Data Successfully',
      data: await this.authorService.getSeries(author_id),
    };
  }
}
