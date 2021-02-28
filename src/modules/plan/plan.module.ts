import { Module } from '@nestjs/common';
import { PlanService } from './service/plan.service';
import { PlanController } from './controller/plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './model/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanEntity])],
  providers: [PlanService],
  controllers: [PlanController],
})
export class PlanModule {}
