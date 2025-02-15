// // src/infrastructure/services/StripePaymentService.ts
// import Stripe from 'stripe';
// import { IPaymentService } from '@/domain/services/IPaymentService';

// export class StripePaymentService implements IPaymentService {
//   private stripe: Stripe;

//   constructor(apiKey: string) {
//     this.stripe = new Stripe(apiKey, { apiVersion: '2023-10-16' });
//   }

//   async createCustomer(email: string, paymentMethodId: string): Promise<string> {
//     const customer = await this.stripe.customers.create({
//       email,
//       payment_method: paymentMethodId,
//       invoice_settings: {
//         default_payment_method: paymentMethodId,
//       },
//     });
//     return customer.id;
//   }

//   async createSubscription(customerId: string, priceId: string) {
//     const subscription = await this.stripe.subscriptions.create({
//       customer: customerId,
//       items: [{ price: priceId }],
//       payment_behavior: 'default_incomplete',
//       payment_settings: { save_default_payment_method: 'on_subscription' },
//       expand: ['latest_invoice.payment_intent'],
//     });

//     return {
//       subscriptionId: subscription.id,
//       clientSecret: subscription.latest_invoice.payment_intent.client_secret,
//     };
//   }

//   async cancelSubscription(subscriptionId: string): Promise<void> {
//     await this.stripe.subscriptions.update(subscriptionId, {
//       cancel_at_period_end: true,
//     });
//   }
// }
