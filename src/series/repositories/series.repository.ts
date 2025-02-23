import { Injectable } from '@nestjs/common';
import { Series } from '@prisma/client';
import { PaginationResponseDto } from 'src/config/dto/pagination-response.dto';
import { PaginationDto } from 'src/config/dto/pagination.dto';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class SeriesRepository {
  constructor(private prismaService: PrismaService) {}

  async findManyWithPagination(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<Series[]>> {
    const { page, limit } = paginationDto;
    const skip = (page! - 1) * limit!;

    const [data, total] = await Promise.all([
      this.prismaService.series.findMany({
        skip,
        take: Number(limit),
        orderBy: { id: 'asc' },
      }),
      this.prismaService.series.count(),
    ]);

    return {
      status: 'success',
      message: 'Data has been successfully retrieved',
      data,
      total,
      page: Number(page!) || 0,
      limit: Number(limit!),
      totalPages: Math.ceil(total / Number(limit!)),
    };
  }
}
