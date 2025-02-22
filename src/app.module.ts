import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule as CM } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    UserModule,
    CM.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
