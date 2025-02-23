import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { HomeRepository } from './repositories/home.repository';

@Module({
  providers: [HomeService, HomeRepository],
  controllers: [HomeController],
})
export class HomeModule {}
