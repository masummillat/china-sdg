import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../utils/model/base.entity';

@Entity('plans')
export class PlanEntity extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ default: 0, nullable: false })
  cost: number;

  @Column({ default: 1, nullable: false })
  month: number;

  @Column({ default: '' })
  description: string;
}
