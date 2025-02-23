import {
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtRoleGuard } from 'src/config/guards/jwtrole.guard';
import { Roles } from 'src/config/decorator/roles.decorator';
import { Request } from 'express';
import { WebResponseDto } from 'src/config/dto/web-response.dto';

@Controller('series')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard)
  @Roles('admin', 'user', 'editor')
  @Patch(':id/bookmark')
  async createBookmark(
    @Req() req: Request,
    @Param('id', ParseIntPipe) series_id: number,
  ): Promise<WebResponseDto<any>> {
    const result = await this.bookmarkService.createBookmark(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      req.user!['sub'],
      series_id,
    );

    return {
      status: 'success',
      message: result ? 'Bookmark Created' : 'Bookmark Deleted',
      data: result,
    };
  }
}
