/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateSeriesDto } from './dto/series-create.dto';
import { Series } from '@prisma/client';
import { UpdateSeriesDto } from './dto/series-update.dto';

@Injectable()
export class SeriesService {
  constructor(private prismaService: PrismaService) {}

  async create(createDto: CreateSeriesDto): Promise<Series> {
    const seriesCount = await this.prismaService.series.count({
      where: { title: createDto.title },
    });
    if (seriesCount > 0) {
      throw new BadRequestException('Series already exists');
    }

    const data = await this.prismaService.series.create({
      data: {
        title: createDto.title,
        alternative: createDto.alternative,
        description: createDto.description!,
        type: createDto.type,
        status: createDto.status,
        release: createDto.release,
        authors: {
          connectOrCreate: createDto.authors.map((author) => ({
            where: { name: author },
            create: { name: author },
          })),
        },
        artists: {
          connectOrCreate: createDto.artists.map((artist) => ({
            where: { name: artist },
            create: { name: artist },
          })),
        },
        genres: {
          connectOrCreate: createDto.genres.map((genre) => ({
            where: { name: genre },
            create: { name: genre },
          })),
        },
      },
      include: {
        authors: true,
        artists: true,
        genres: true,
      },
    });
    return data;
  }

  async getSeries(series_id: number): Promise<Series> {
    const series = await this.prismaService.series.findFirst({
      where: { id: series_id },
      include: {
        authors: { select: { id: true, name: true } },
        artists: { select: { id: true, name: true } },
        genres: { select: { id: true, name: true } },
      },
    });
    if (!series) {
      throw new BadRequestException('Series not found');
    }
    return series;
  }

  async getUpdateSeries(series_id: number): Promise<any> {
    const series = await this.prismaService.series.findFirst({
      where: { id: series_id },
      include: {
        authors: { select: { name: true } },
        artists: { select: { name: true } },
        genres: { select: { name: true } },
      },
    });
    if (!series) {
      throw new BadRequestException('Series not found');
    }
    return {
      ...series,
      authors: series.authors.map((author) => author.name),
      artists: series.artists.map((artist) => artist.name),
      genres: series.genres.map((genre) => genre.name),
    };
  }

  async update(series_id: number, updateDto: UpdateSeriesDto): Promise<Series> {
    const series = await this.prismaService.series.findFirst({
      where: { id: series_id },
    });
    if (!series) {
      throw new BadRequestException('Series not found');
    }

    const data = await this.prismaService.series.update({
      where: { id: series_id },
      data: {
        title: updateDto.title,
        alternative: updateDto.alternative,
        description: updateDto.description!,
        type: updateDto.type,
        status: updateDto.status,
        release: updateDto.release,
        authors: {
          set: [],
          connectOrCreate: updateDto.authors.map((author) => ({
            where: { name: author },
            create: { name: author },
          })),
        },
        artists: {
          set: [],
          connectOrCreate: updateDto.artists.map((artist) => ({
            where: { name: artist },
            create: { name: artist },
          })),
        },
        genres: {
          set: [],
          connectOrCreate: updateDto.genres.map((genre) => ({
            where: { name: genre },
            create: { name: genre },
          })),
        },
      },
      include: {
        authors: { select: { id: true, name: true } },
        artists: { select: { id: true, name: true } },
        genres: { select: { id: true, name: true } },
      },
    });
    return data;
  }
}
