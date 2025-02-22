/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/series-create.dto';
import { JwtRoleGuard } from 'src/config/guards/jwtrole.guard';
import { Roles } from 'src/config/decorator/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { WebResponseDto } from 'src/config/dto/web-response.dto';
import { Series } from '@prisma/client';
import { UpdateSeriesDto } from './dto/series-update.dto';

@Controller('series')
export class SeriesController {
  constructor(private seriesService: SeriesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard)
  @Roles('admin', 'user')
  async create(
    @Body() createDto: CreateSeriesDto,
  ): Promise<WebResponseDto<Series>> {
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
  async updateSeries(
    @Param('id', ParseIntPipe) series_id: number,
    @Body() updateDto: UpdateSeriesDto,
  ): Promise<WebResponseDto<Series>> {
    return {
      status: 'success',
      message: 'Update Series Data Successfully',
      data: await this.seriesService.update(series_id, updateDto),
    };
  }
}
