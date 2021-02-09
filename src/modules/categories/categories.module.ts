import { Module } from '@nestjs/common';
import { CategoriesService } from './service/categories.service';
import { CategoriesController } from './controller/categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntryEntity } from './model/category-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntryEntity])],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
