/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class GenreService {
  constructor(private prismaService: PrismaService) {}

  async getSeries(genre_id: number): Promise<any> {
    const series = await this.prismaService.series.findMany({
      where: {
        genres: {
          some: {
            id: genre_id,
          },
        },
      },
    });

    return series;
  }
}
