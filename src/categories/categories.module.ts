import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntryEntity } from './model/category-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntryEntity])],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
