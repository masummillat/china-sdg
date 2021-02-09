import { AuthorRequestEntity } from './modules/users/model/authorRequest.entity';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './modules/users/model/user.entity';
import { Connection } from 'typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { BlogController } from './modules/blog/blog.controller';
import { BlogService } from './modules/blog/service/blog.service';
import { BlogModule } from './modules/blog/blog.module';
import { BlogEntryEntity } from './modules/blog/model/blog-entry.entity';
import { CategoriesModule } from './modules/categories/categories.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [
    BlogModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [UserEntity, BlogEntryEntity, AuthorRequestEntity],
      synchronize: true,
      autoLoadEntities: true,
      // ssl: { rejectUnauthorized: false },
      // url:
      //   'postgres://uhyfdhlggdazea:b8e0cd14d7b2f129d8def0737fc7049bf01842a2472ebd5046968691cd211235@ec2-52-72-190-41.compute-1.amazonaws.com:5432/dar6naepu6npga',
    }),
    CategoriesModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
