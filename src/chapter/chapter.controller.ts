import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtRoleGuard } from 'src/config/guards/jwtrole.guard';
import { Roles } from 'src/config/decorator/roles.decorator';
import { CreateChapterDto } from './dto/chapter-create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { WebResponseDto } from 'src/config/dto/web-response.dto';
import { DeleteChapterDto } from './dto/chapter-delete.dto';

@Controller('series/:series_id')
export class ChapterController {
  constructor(private chapterService: ChapterService) {}

  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard)
  @Roles('admin', 'user')
  @Post('/chapter')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload Chapter',
    type: CreateChapterDto,
  })
  @UseInterceptors(
    FileInterceptor('zipchapter', {
      storage: diskStorage({
        destination: './uploads/tmp',
        filename(req, file, callback) {
          const filename = `${Date.now()}-${file.originalname}`;
          callback(null, filename);
        },
      }),
      fileFilter(req, file, callback) {
        if (file.mimetype !== 'application/zip') {
          return callback(
            new BadRequestException('Only ZIP files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  async uploadChapter(
    @Param('series_id', ParseIntPipe) series_id: number,
    @UploadedFile() chapterzip: Express.Multer.File,
    @Body() createDto: CreateChapterDto,
  ): Promise<WebResponseDto<any>> {
    if (!chapterzip) {
      throw new BadRequestException('Chapter ZIP file is required');
    }

    createDto.series_id = series_id; // ada
    createDto.zipchapter = chapterzip;

    return {
      status: 'success',
      message: 'Chapter Uploaded',
      data: await this.chapterService.createChapter(createDto),
    };
  }

  @Get('chapter-:id')
  async getChapter(
    @Param('series_id', ParseIntPipe) series_id: number,
    @Param('id', ParseIntPipe) chapter_number: number,
  ): Promise<WebResponseDto<any>> {
    return {
      status: 'success',
      message: 'Chapter Found',
      data: await this.chapterService.getChapter(series_id, chapter_number),
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard)
  @Roles('admin', 'user')
  @Delete('/chapter')
  async deleteChapter(
    @Param('series_id', ParseIntPipe) series_id: number,
    @Body() deleteDto: DeleteChapterDto,
  ): Promise<WebResponseDto<boolean>> {
    console.log('DI CONTROLLER');
    deleteDto.series_id = series_id;
    return {
      status: 'success',
      message: 'Chapter Deleted',
      data: await this.chapterService.deleteChapter(deleteDto),
    };
  }
}
