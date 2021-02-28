import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../utils/model/base.entity';
import { UserEntity } from '../../users/model/user.entity';
import { UserInterface } from '../../users/interface/user.interface';
import { PlanEntity } from '../../plan/model/plan.entity';
import { PlanInterface } from '../../plan/interface/plan.interface';

@Entity('subscriptions')
export class SubscriptionEntity extends BaseEntity {
  @ManyToOne((type) => UserEntity, (user: UserInterface) => user)
  author: UserEntity;

  @ManyToOne((type) => PlanEntity, (plan: PlanInterface) => plan)
  plan: PlanEntity;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  subscriptionStart: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  subscriptionEnd: Date;
}
