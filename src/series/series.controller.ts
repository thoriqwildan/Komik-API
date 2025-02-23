/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/series-create.dto';
import { JwtRoleGuard } from 'src/config/guards/jwtrole.guard';
import { Roles } from 'src/config/decorator/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { WebResponseDto } from 'src/config/dto/web-response.dto';
import { Series } from '@prisma/client';
import { UpdateSeriesDto } from './dto/series-update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Controller('series')
export class SeriesController {
  constructor(private seriesService: SeriesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard)
  @Roles('admin', 'user')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create Series',
    type: CreateSeriesDto,
  })
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: './uploads/series_covers',
        filename(req, file, callback) {
          const date = new Date()
            .toISOString()
            .replace(/:/g, '-')
            .replace('T', '_')
            .replace('Z', '');
          const extension: string = path.extname(file.originalname);
          const filename = `${date}${extension}`;

          callback(null, filename);
        },
      }),
      fileFilter(req, file, callback) {
        const allowedTypes = /jpg|jpeg|png/;
        const extname = allowedTypes.test(
          path.extname(file.originalname).toLowerCase(),
        );
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) return callback(null, true);
        else
          return callback(
            new HttpException('Only JPG, JPEG, PNG files are allowed', 400),
            false,
          );
      },
      limits: { fileSize: 3 * 1024 * 1024 },
    }),
  )
  async create(
    @UploadedFile() cover: Express.Multer.File,
    @Body(new ValidationPipe({ transform: true })) createDto: CreateSeriesDto,
  ): Promise<WebResponseDto<Series>> {
    console.log(createDto);
    if (cover) {
      const title = createDto.title.replace(/\s+/g, '-').toLowerCase();
      const date = new Date()
        .toISOString()
        .replace(/:/g, '-')
        .replace('T', '_')
        .replace('Z', '');
      const extension: string = path.extname(cover.originalname);
      const filename = `${title}-${date}${extension}`;
      const oldPath = cover.path;
      const newPath = path.join(path.dirname(oldPath), filename);

      const dirPath = './uploads/series_covers';
      try {
        const files = fs.readdirSync(dirPath);
        const filteredFiles = files.filter((f) => f.includes(title));
        if (filteredFiles.length > 0) {
          filteredFiles.forEach((f) => {
            const filePath = path.join(dirPath, f);
            fs.unlinkSync(filePath);
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new BadRequestException('Failed to delete old cover');
      }

      fs.renameSync(oldPath, newPath);

      createDto.file = `/series_covers/${filename}`;
    }
    return {
      status: 'success',
      message: 'Series Created',
      data: await this.seriesService.create(createDto),
    };
  }

  @Get(':id')
  async getSeries(
    @Param('id', ParseIntPipe) series_id: number,
  ): Promise<WebResponseDto<Series>> {
    return {
      status: 'success',
      message: 'Get Series Data Successfully',
      data: await this.seriesService.getSeries(series_id),
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard)
  @Roles('admin', 'user')
  @Get(':id/update')
  async getUpdateSeries(
    @Param('id', ParseIntPipe) series_id: number,
  ): Promise<WebResponseDto<Series>> {
    return {
      status: 'success',
      message: 'Get Series Data Successfully',
      data: await this.seriesService.getUpdateSeries(series_id),
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard)
  @Roles('admin', 'user')
  @Patch(':id/update')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update Series',
    type: UpdateSeriesDto,
  })
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: './uploads/series_covers',
        filename(req, file, callback) {
          const date = new Date()
            .toISOString()
            .replace(/:/g, '-')
            .replace('T', '_')
            .replace('Z', '');
          const extension: string = path.extname(file.originalname);
          const filename = `${date}${extension}`;

          callback(null, filename);
        },
      }),
      fileFilter(req, file, callback) {
        const allowedTypes = /jpg|jpeg|png/;
        const extname = allowedTypes.test(
          path.extname(file.originalname).toLowerCase(),
        );
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) return callback(null, true);
        else
          return callback(
            new HttpException('Only JPG, JPEG, PNG files are allowed', 400),
            false,
          );
      },
      limits: { fileSize: 3 * 1024 * 1024 },
    }),
  )
  async updateSeries(
    @Param('id', ParseIntPipe) series_id: number,
    @UploadedFile() cover: Express.Multer.File,
    @Body(new ValidationPipe({ transform: true })) updateDto: UpdateSeriesDto,
  ): Promise<WebResponseDto<Series>> {
    console.log(updateDto);
    if (cover) {
      const title = updateDto.title.replace(/\s+/g, '-').toLowerCase();
      const date = new Date()
        .toISOString()
        .replace(/:/g, '-')
        .replace('T', '_')
        .replace('Z', '');
      const extension: string = path.extname(cover.originalname);
      const filename = `${title}-${date}${extension}`;
      const oldPath = cover.path;
      const newPath = path.join(path.dirname(oldPath), filename);

      const dirPath = './uploads/series_covers';
      try {
        const files = fs.readdirSync(dirPath);
        const filteredFiles = files.filter((f) => f.includes(title));
        if (filteredFiles.length > 0) {
          filteredFiles.forEach((f) => {
            const filePath = path.join(dirPath, f);
            fs.unlinkSync(filePath);
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new BadRequestException('Failed to delete old cover');
      }

      fs.renameSync(oldPath, newPath);

      updateDto.file = `/series_covers/${filename}`;
    }
    return {
      status: 'success',
      message: 'Update Series Data Successfully',
      data: await this.seriesService.update(series_id, updateDto),
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard)
  @Roles('admin', 'user')
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) series_id: number,
  ): Promise<WebResponseDto<any>> {
    return {
      status: 'success',
      message: 'Delete Series Data Successfully',
      data: await this.seriesService.delete(series_id),
    };
  }
}
