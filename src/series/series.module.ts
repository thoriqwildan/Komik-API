import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { SeriesRepository } from './repositories/series.repository';

@Module({
  providers: [SeriesService, SeriesRepository],
  controllers: [SeriesController],
})
export class SeriesModule {}
