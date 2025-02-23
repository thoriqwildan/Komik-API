import { Controller, Get, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { PaginationDto } from 'src/config/dto/pagination.dto';

@Controller('home')
export class HomeController {
  constructor(private homeService: HomeService) {}

  @Get('newest')
  async getNewest(@Query() paginationDto: PaginationDto) {
    return this.homeService.getNewest(paginationDto);
  }
}
