import { Body, Injectable } from '@nestjs/common';
import { from, Observable, of } from 'rxjs';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from '../model/subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInterface } from '../../users/interface/user.interface';
import { SubscriptionInterface } from '../interface/subscription.interface';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox', // Sandbox or live
  client_id:
    'AXKPqjPDSk0FavisHzGK2CjRPNYy255h8W-FrSgg-IFvOgv44_l5vyKX8wq4iFqDvASMWWH9PFYP_xjc',
  client_secret:
    'ENmDTnNvnAsISquiOuhWHAzDqp4fkq8bk6nTWchpdRbhxmA_WFcElKISjXoC_t2fg1OcoMcxqTgyE6DG',
});

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private subscriptionRepository: Repository<SubscriptionEntity>,
  ) {}
  findAll(): Observable<any> {
    return from(this.subscriptionRepository.find());
  }

  findOne(id: number): Observable<any> {
    return from(this.subscriptionRepository.findOne(id));
  }

  create(user: UserInterface, body: SubscriptionInterface): Observable<any> {;
    body.author = user;
    return from(this.subscriptionRepository.save(body));
  }

  createPayment(@Body() body) {
    const payReq = JSON.stringify({
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `${process.env.FRONTEND_BASE_URL}/process`,
        cancel_url: `${process.env.FRONTEND_BASE_URL}/cancel`,
      },
      transactions: [
        {
          amount: {
            total: '10',
            currency: 'USD',
          },
          description: 'This is the payment transaction description.',
        },
      ],
    });
    paypal.payment.create(payReq, function (error, payment) {
      const links = {};

      if (error) {
        console.error(JSON.stringify(error));
      } else {
        // Capture HATEOAS links
        payment.links.forEach(function (linkObj) {
          links[linkObj.rel] = {
            href: linkObj.href,
            method: linkObj.method,
          };
        });

        // If the redirect URL is present, redirect the customer to that URL
        if (links.hasOwnProperty('approval_url')) {
          // Redirect the customer to links['approval_url'].href
          console.log(links['approval_url'].href);
        } else {
          console.error('no redirect URI present');
        }
      }
    });
  }

  executePayment(body: any) {
    const { paymentId, payerId } = body;
    paypal.payment.execute(paymentId, payerId, function (error, payment) {
      if (error) {
        console.error(JSON.stringify(error));
      } else {
        if (payment.state == 'approved') {
          console.log('payment completed successfully');
        } else {
          console.log('payment not successful');
        }
      }
    });
  }

  update(body: any, id: number): Observable<any> {
    return from(this.subscriptionRepository.save(body));
  }

  delete(id: number): Observable<any> {
    return from(this.subscriptionRepository.delete(id));
  }
}
