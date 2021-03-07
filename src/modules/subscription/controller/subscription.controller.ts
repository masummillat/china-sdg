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
import { Observable, of } from 'rxjs';
import { SubscriptionService } from '../service/subscription.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SubscriptionEntity } from '../model/subscription.entity';
import moment from 'moment';

@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get()
  findAll(): Observable<any> {
    return this.subscriptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<any> {
    return this.subscriptionService.findOne(id);
  }
  @Post()
  create(@Body() body: any, @Request() req): Observable<any> {
    const user = req.user;
    console.log(body);
    let newSubscription = new SubscriptionEntity();
    newSubscription = body;
    const date = new Date();
    newSubscription.subscriptionEnd = new Date(
      date.setMonth(date.getMonth() + Number(body.plan.month)),
    );
    console.log(newSubscription)
    return this.subscriptionService.create(user, newSubscription);
  }

  @Put(':id')
  update(@Body() body: any, @Param(':id') id: number): Observable<any> {
    return this.subscriptionService.update(body, id);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Observable<any> {
    return this.subscriptionService.delete(id);
  }

  @Post('/create-payment')
  createPayment(@Body() body: any) {
    return this.subscriptionService.createPayment(body);
  }

  @Post('/execute-payment')
  executePayment(@Body() body: any) {
    return this.subscriptionService.executePayment(body);
  }
}
