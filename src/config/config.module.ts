import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule as cm } from '@nestjs/config';

@Global()
@Module({
  imports: [cm.forRoot({ isGlobal: true })],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class ConfigModule {}
