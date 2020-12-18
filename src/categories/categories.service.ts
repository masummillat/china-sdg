import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CategoryEntryEntity } from './model/category-entry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntry } from './model/category.entry';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntryEntity)
    private readonly categoriesRepository: Repository<CategoryEntryEntity>,
  ) {}

  create(categoryEntry: CategoryEntry): Observable<CategoryEntry> {
    return from(this.categoriesRepository.save(categoryEntry));
  }

  findOne(id: number): Observable<CategoryEntry> {
    return from(this.categoriesRepository.findOne(id));
  }

  findAll(): Observable<CategoryEntry[]> {
    return from(this.categoriesRepository.find());
  }
  updateOne(
    id: number,
    categoryEntry: CategoryEntry,
  ): Observable<CategoryEntry> {
    return from(this.categoriesRepository.update(id, categoryEntry)).pipe(
      switchMap(() => this.findOne(id)),
    );
  }

  deleteOne(id: number): Observable<any> {
    return from(this.categoriesRepository.delete(id));
  }
}
