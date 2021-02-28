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
import { Observable } from 'rxjs';
import { SubscriptionService } from '../service/subscription.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

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
    return this.subscriptionService.create(user, body);
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
