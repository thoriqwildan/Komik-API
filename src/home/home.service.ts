import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/config/dto/pagination.dto';
import { PrismaService } from 'src/config/prisma.service';
import { HomeRepository } from './repositories/home.repository';

@Injectable()
export class HomeService {
  constructor(
    private prismaService: PrismaService,
    private homeRepository: HomeRepository,
  ) {}

  async getNewest(paginationDto: PaginationDto) {
    return this.homeRepository.findManyWithPagination(paginationDto);
  }
}
