/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateSeriesDto } from './dto/series-create.dto';
import { Series } from '@prisma/client';
import { UpdateSeriesDto } from './dto/series-update.dto';
import * as fs from 'fs';
import { PaginationDto } from 'src/config/dto/pagination.dto';
import { SeriesRepository } from './repositories/series.repository';
import { CreateChapterDto } from './dto/chapter-create.dto';
import * as unzipper from 'unzipper';
import * as path from 'path';
import * as sharp from 'sharp';
import { DeleteChapterDto } from './dto/chapter-delete.dto';

@Injectable()
export class SeriesService {
  constructor(
    private prismaService: PrismaService,
    private seriesRepository: SeriesRepository,
  ) {}

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
        imgUrl: createDto.file,
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
        chapters: { select: { dirUrl: true } },
      },
    });
    if (!series) {
      throw new BadRequestException('Series not found');
    }

    const series_data = {
      ...series,
      authors: series.authors.map((val) => val.name),
      artists: series.artists.map((val) => val.name),
      genres: series.genres.map((val) => val.name),
      chapters: series.chapters.map((val) => val.dirUrl),
    };

    return series_data;
  }

  async getAllSeries(paginationDto: PaginationDto) {
    return this.seriesRepository.findManyWithPagination(paginationDto);
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
        imgUrl: updateDto.file,
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

  async delete(series_id: number): Promise<any> {
    const series = await this.prismaService.series.findFirst({
      where: { id: series_id },
    });
    if (!series) {
      throw new BadRequestException('Series not found');
    }

    const dirPath = `./uploads${series.imgUrl}`;
    try {
      fs.unlinkSync(dirPath);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Failed to delete cover');
    }

    await this.prismaService.series.delete({
      where: { id: series_id },
    });
    return true;
  }

  async createChapter(createDto: CreateChapterDto) {
    const series = await this.prismaService.series.findFirst({
      where: { id: createDto.series_id },
    });
    if (!series) {
      throw new BadRequestException('Series not found');
    }

    const uploadDir = `./uploads/data/${series?.title.toLowerCase().replace(/\s+/g, '-')}/${createDto.chapter}`;
    fs.mkdirSync(uploadDir, { recursive: true });

    const zipPath = createDto.zipchapter?.path;
    console.log(zipPath);

    await fs
      .createReadStream(zipPath!)
      .pipe(unzipper.Extract({ path: uploadDir }))
      .promise()
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Failed to extract ZIP file');
      });

    fs.unlinkSync(zipPath!);

    const dir_url = `/data/${series?.title.toLowerCase().replace(/\s+/g, '-')}/${createDto.chapter}`;

    let files = fs.readdirSync(uploadDir);
    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      const parsedFIle = path.parse(file).name;
      const outputFilePath = path.join(uploadDir, `r-${parsedFIle}.jpg`);

      if (/\.(jpg|jpeg|png)$/i.test(file)) {
        await sharp(filePath)
          .resize(800)
          .toFormat('jpg')
          .toFile(outputFilePath);
        fs.unlinkSync(filePath);
      }
    }
    files = fs.readdirSync(uploadDir);
    files = files.filter((f) => /\.(jpg|jpeg|png)$/i.test(f));
    files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const images = files.map(
      (file) =>
        `/data/${series?.title.toLowerCase().replace(/\s+/g, '-')}/${createDto.chapter}/${file}`,
    );

    const data = await this.prismaService.chapter.create({
      data: {
        chapter: createDto.chapter,
        dirUrl: dir_url,
        series: {
          connect: { id: createDto.series_id },
        },
      },
      include: { images: true },
    });

    await this.prismaService.chapter_Image.createMany({
      data:
        images.map((image) => ({
          chapter_id: data.id,
          image_url: image,
        })) || [],
    });

    const returndata = await this.prismaService.chapter.findFirst({
      where: { id: data.id },
      include: { images: { select: { image_url: true } } },
    });

    const datachapter = {
      ...returndata,
      images: returndata?.images.map((img) => img.image_url),
    };

    return datachapter;
  }

  async deleteChapter(deleteChapterDto: DeleteChapterDto) {
    const series = await this.prismaService.series.findFirst({
      where: { id: deleteChapterDto.series_id },
    });
    if (!series) {
      throw new BadRequestException('Series not found');
    }
    const chapter = await this.prismaService.chapter.findFirst({
      where: {
        series_id: deleteChapterDto.series_id,
        chapter: deleteChapterDto.chapter_number.toString(),
      },
    });
    if (!chapter) {
      throw new BadRequestException('Chapter not found');
    }
    fs.rmSync(`./uploads${chapter.dirUrl}`, { recursive: true, force: true });
    await this.prismaService.chapter.delete({
      where: { id: chapter.id },
    });

    return true;
  }
}
