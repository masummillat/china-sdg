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
import { JwtAuthGuard, Public } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../users/dto/user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(
    @Body() categoryEntry: CategoryEntry,
    @Request() req,
  ): Observable<CategoryEntry> {
    return this.categoriesService.create(categoryEntry);
  }

  @Public()
  @Get(':id')
  findOne(@Param() id: number): Observable<CategoryEntry> {
    return this.categoriesService.findOne(id);
  }

  @Public()
  @Get()
  findAll(): Observable<CategoryEntry[]> {
    return this.categoriesService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Put(':id')
  update(
    @Param() id: number,
    @Body() categoryEntry: CategoryEntry,
  ): Observable<CategoryEntry> {
    return this.categoriesService.updateOne(id, categoryEntry);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  deleteOne(@Param() id: number): Observable<any> {
    return this.categoriesService.deleteOne(id);
  }
}
