import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule as CM } from '@nestjs/config';
import { SeriesModule } from './series/series.module';
import { AuthorModule } from './author/author.module';
import { GenreModule } from './genre/genre.module';
import { ArtistModule } from './artist/artist.module';
import { ChapterModule } from './chapter/chapter.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    UserModule,
    CM.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    SeriesModule,
    AuthorModule,
    GenreModule,
    ArtistModule,
    ChapterModule,
    BookmarkModule,
    HomeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
