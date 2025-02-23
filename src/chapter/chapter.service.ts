/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateChapterDto } from './dto/chapter-create.dto';
import * as fs from 'fs';
import * as unzipper from 'unzipper';
import * as path from 'path';
import * as sharp from 'sharp';
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
