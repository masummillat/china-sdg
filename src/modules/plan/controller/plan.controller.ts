import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PlanService } from '../service/plan.service';

@Controller('plans')
export class PlanController {
  constructor(private planService: PlanService){};
  @Get()
  findAll(): Observable<any> {
    return this.planService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<any> {
    return this.planService.findOne(id);
  }
  @Post()
  create(@Body() body: any): Observable<any> {
    return this.planService.create(body);
  }

  @Put(':id')
  update(@Body() body: any, @Param(':id') id: number): Observable<any> {
    return this.planService.update(body, id);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Observable<any> {
    return this.planService.delete(id);
  }
}
