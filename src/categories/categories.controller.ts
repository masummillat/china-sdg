import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CategoryEntry } from './model/category.entry';
import { Observable, of } from 'rxjs';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}
  @Post()
  create(
    @Body() categoryEntry: CategoryEntry,
    @Request() req,
  ): Observable<CategoryEntry> {
    return this.categoriesService.create(categoryEntry);
  }
  @Get(':id')
  findOne(@Param() id: number): Observable<CategoryEntry> {
    return this.categoriesService.findOne(id);
  }
  @Get()
  findAll(): Observable<CategoryEntry[]> {
    return this.categoriesService.findAll();
  }
  @Put(':id')
  update(
    @Param() id: number,
    @Body() categoryEntry: CategoryEntry,
  ): Observable<CategoryEntry> {
    return this.categoriesService.updateOne(id, categoryEntry);
  }
  @Delete(':id')
  deleteOne(@Param() id: number): Observable<any> {
    return this.categoriesService.deleteOne(id);
  }
}
