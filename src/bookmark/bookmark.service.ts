/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prismaService: PrismaService) {}

  async createBookmark(username: string, series_id: number) {
    const user = await this.prismaService.user.findFirst({
      where: { username },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const series = await this.prismaService.series.findFirst({
      where: { id: series_id },
    });
    if (!series) {
      throw new BadRequestException('Series not found');
    }

    const bookmark = await this.prismaService.bookmark.findFirst({
      where: { username: username, series_id: series_id },
    });
    if (bookmark) {
      await this.prismaService.bookmark.deleteMany({
        where: { username: username, series_id: series_id },
      });
      return false;
    }

    await this.prismaService.bookmark.create({
      data: {
        username: username,
        series_id: series_id,
      },
    });

    return true;
  }

  async deleteBookmark(username: string, series_id: number) {
    const user = await this.prismaService.user.findFirst({
      where: { username },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const series = await this.prismaService.series.findFirst({
      where: { id: series_id },
    });
    if (!series) {
      throw new BadRequestException('Series not found');
    }
    await this.prismaService.bookmark.deleteMany({
      where: {
        username: username,
        series_id: series_id,
      },
    });
    return true;
  }
}
