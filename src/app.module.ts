import { AuthorRequestEntity } from './users/model/authorRequest.entity';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/user.entity';
import { Connection } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { BlogController } from './blog/blog.controller';
import { BlogService } from './blog/service/blog.service';
import { BlogModule } from './blog/blog.module';
import { BlogEntryEntity } from './blog/model/blog-entry.entity';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    BlogModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [UserEntity, BlogEntryEntity, AuthorRequestEntity],
      synchronize: true,
      autoLoadEntities: true,
      ssl: { rejectUnauthorized: false },
      url:
        'postgres://uhyfdhlggdazea:b8e0cd14d7b2f129d8def0737fc7049bf01842a2472ebd5046968691cd211235@ec2-52-72-190-41.compute-1.amazonaws.com:5432/dar6naepu6npga',
    }),
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
