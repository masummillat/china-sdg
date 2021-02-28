import { UserInterface } from '../../users/interface/user.interface';
import { PlanInterface } from '../../plan/interface/plan.interface';

export interface SubscriptionInterface {
  id?: number;
  author?: UserInterface;
  plan?: PlanInterface;
  subscriptionStart: Date;
  subscriptionEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}
