import { Module } from '@nestjs/common';
import { BlogService } from './service/blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntryEntity } from './model/blog-entry.entity';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntryEntity]), UsersModule],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
