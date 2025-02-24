/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateChapterDto } from './dto/chapter-create.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import * as decompress from 'decompress';
import { DeleteChapterDto } from './dto/chapter-delete.dto';

@Injectable()
export class ChapterService {
  constructor(private prismaService: PrismaService) {}

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
    console.log(uploadDir);

    await decompress(zipPath, uploadDir).catch((err) => {
      console.log(err);
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
        title: createDto.title,
        dirUrl: dir_url,
        series: {
          connect: { id: createDto.series_id },
        },
      },
      include: { images: true },
    });

    await this.prismaService.series.update({
      where: { id: createDto.series_id },
      data: { updated_at: new Date() },
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

  async getChapter(series_id: number, chapter_number: number) {
    const series = await this.prismaService.series.findFirst({
      where: { id: series_id },
    });
    if (!series) {
      throw new BadRequestException('Series not found');
    }
    const chapter = await this.prismaService.chapter.findFirst({
      where: { series_id: series_id, chapter: chapter_number.toString() },
      include: { images: { select: { image_url: true } } },
    });

    const previous = await this.prismaService.chapter
      .findFirst({
        where: {
          series_id: series_id,
          chapter: (chapter_number - 1).toString(),
        },
      })
      .then((chap) => !!chap);

    const next = await this.prismaService.chapter
      .findFirst({
        where: {
          series_id: series_id,
          chapter: (chapter_number + 1).toString(),
        },
      })
      .then((chap) => !!chap);

    if (!chapter) {
      throw new BadRequestException('Chapter not found');
    }

    const ch_data = {
      ...chapter,
      images: chapter.images.map((img) => img.image_url),
    };

    return { data: ch_data, previous, next };
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
