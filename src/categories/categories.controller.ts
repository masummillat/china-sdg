import { Pagination } from 'nestjs-typeorm-paginate';
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
  Query,
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
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Observable<Pagination<CategoryEntry>> {
    // limit = limit > 100 ? 100 : limit;
    return this.categoriesService.findAll({
      limit: Number(limit),
      page: Number(page),
      route: `${process.env.BASE_URL}/categories`,
    });
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
