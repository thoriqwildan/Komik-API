/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class AuthorService {
  constructor(private prismaService: PrismaService) {}

  async getSeries(author_id: number): Promise<any> {
    const series = await this.prismaService.series.findMany({
      where: {
        authors: {
          some: {
            id: author_id,
          },
        },
      },
    });

    return series;
  }
}
