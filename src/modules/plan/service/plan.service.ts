import { Injectable } from '@nestjs/common';
import { from, Observable, of } from 'rxjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanEntity } from '../model/plan.entity';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(PlanEntity)
    private planRepository: Repository<PlanEntity>,
  ) {}
  findAll(): Observable<any> {
    return from(this.planRepository.find());
  }

  findOne(id: number): Observable<any> {
    return from(this.planRepository.findOne(id));
  }

  create(body: any): Observable<any> {
    return from(this.planRepository.save(body));
  }

  update(body: any, id: number): Observable<any> {
    return from(this.planRepository.save(body));
  }

  delete(id: number): Observable<any> {
    return from(this.planRepository.delete(id));
  }
}
