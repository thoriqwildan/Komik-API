import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtRoleGuard } from 'src/config/guards/jwtrole.guard';
import { Roles } from 'src/config/decorator/roles.decorator';
import { Request } from 'express';
import { WebResponseDto } from 'src/config/dto/web-response.dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard)
  @Roles('admin', 'user')
  @Post(':id/bookmark')
  async createBookmark(
    @Req() req: Request,
    @Param('id', ParseIntPipe) series_id: number,
  ): Promise<WebResponseDto<any>> {
    return {
      status: 'success',
      message: 'Bookmark Created',
      data: await this.bookmarkService.createBookmark(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        req.user!['sub'],
        series_id,
      ),
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard)
  @Roles('admin', 'user')
  @Delete(':id/bookmark')
  async deleteBookmark(
    @Req() req: Request,
    @Param('id', ParseIntPipe) series_id: number,
  ): Promise<WebResponseDto<any>> {
    return {
      status: 'success',
      message: 'Bookmark Deleted',
      data: await this.bookmarkService.deleteBookmark(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        req.user!['sub'],
        series_id,
      ),
    };
  }
}
