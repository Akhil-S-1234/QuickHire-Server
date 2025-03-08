
// import CreateSubscriptionDto from '../../dtos/User/createSubscriptionDto'
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { RazorpayRepository } from '../../../domain/repositories/RazorpayRepository';
// import SubscriptionPlan from '@infrastructure/database/models/SubscriptionPlanModel';
import { SubscriptionRepository } from '../../../domain/repositories/SubscriptionRepository';
import { createHmac } from 'crypto'; 

export class SubscriptionUseCase {
     constructor(
          private userRepository: UserRepository,
          private subscriptionRepository: SubscriptionRepository,
          private razorpayRepository: RazorpayRepository
     ) { }

     async createSubscription(data: any): Promise<any> {

          // const razorpaySubscription = await this.razorpayRepository.createSubscription({
          //      plan_id: data.planId,
          //      total_count: data.totalCount,
          //      quantity: 1,
          //      customer_notify: 1,
          //      notes: {
          //        userId: data.userId
          //      }
          //    });

          //    return razorpaySubscription;

          if (data.autoRenewal) {
               // Create recurring subscription
               const subscription = await this.razorpayRepository.createSubscription({
                    plan_id: data.planId,
                    total_count: data.totalCount,
                    quantity: 1,
                    customer_notify: 1,
                    notes: {
                         userId: data.userId,
                         email: data.email,
                         autoRenewal: true
                    }
               });

               return subscription;
          } else {
               // Create one-time subscription order
               const order = await this.razorpayRepository.createOrder({
                    amount: data.amount,
                    currency: 'INR',
                    notes: {
                         userId: data.userId,
                         email: data.email,
                         planId: data.planId,
                         autoRenewal: false
                    }
               });

               return {
                    id: order.id,
                    type: 'order',
                    amount: order.amount,
                    currency: order.currency
               };
          }
     }

     async activateSubscription(data: any): Promise<any> {

          const user = await this.userRepository.findByEmail(data.email);
          if (!user) {
               throw new Error('User not found');
          }

          const valid = await this.razorpayRepository.verifyPaymentSignature(data)

          console.log('data', data)
          console.log(valid)

          const subscription = await this.razorpayRepository.getSubscription(data.razorpaySubscriptionId)

          const payment = await this.razorpayRepository.getPayment(data.razorpayPaymentId)

          console.log('subscription', subscription)
          console.log('payment', payment)

          const subscriptionData = {
               userId: user.id,
               planId: data.planDetails.planId,
               name: data.planDetails.name,
               price: data.planDetails.price,
               interval: data.planDetails.interval,
               features: data.planDetails.features,
               razorpaySubscriptionId: subscription.id,
               razorpayCustomerId: 'ewfwefewr3r3rr', // Assuming this exists in user model
               status: subscription.status as "active" | "cancelled" | "expired" | "past_due",
               autoRenewal: data.autoRenewal,
               currentPeriodStart: subscription.currentStart,
               currentPeriodEnd: subscription.currentEnd,
               paymentMethod: {
                    id: payment.method,
                    last4: payment.card?.last4 || '',
                    type: payment.card?.type || payment.method
               },
               renewalHistory: [{
                    date: new Date(),
                    status: payment.status === 'captured' ? 'success' : 'failed',
                    paymentId: payment.id,
                    amount: payment.amount / 100,
                    failureReason: payment.error_description
               }]
          };

          // 6. Save subscription
          const activatedSubscription = await this.subscriptionRepository
               .createSubscription(subscriptionData);

          // 7. Add any additional business logic here
          // For example: Send welcome email, activate features, etc.

          return activatedSubscription;

     }

     async getSubscriptionDetails(email: string): Promise<any> {

          const user = await this.userRepository.findByEmail(email);
          if (!user) {
               throw new Error('User not found');
          }

          const subscriptionDetails = await this.subscriptionRepository.findById(user.id)

          console.log(subscriptionDetails)
          return subscriptionDetails
     }

     async activateOrder(data: any): Promise<any> {
          const user = await this.userRepository.findByEmail(data.email);
          if (!user) {
               throw new Error('User not found');
          }

          console.log(data)

          // 2. Verify payment signature
          const valid = await this.razorpayRepository.verifyPaymentSignature({
               razorpaySubscriptionId: data.razorpayOrderId,
               razorpayPaymentId: data.razorpayPaymentId,
               razorpaySignature: data.razorpaySignature,
               autoRenewal: data.autoRenewal
          });

          if (!valid) {
               throw new Error('Invalid payment signature');
          }

          // 3. Get payment details from Razorpay
          const payment = await this.razorpayRepository.getPayment(data.razorpayPaymentId);

          const currentPeriodStart = new Date();
          const currentPeriodEnd = new Date(currentPeriodStart);
          currentPeriodEnd.setMonth(currentPeriodStart.getMonth() + data.planDetails.interval);

          // 4. Prepare subscription data (one-time payment)
          const subscriptionData = {
               userId: user.id,
               planId: data.planDetails.planId,
               name: data.planDetails.name,
               price: data.planDetails.price,
               interval: data.planDetails.interval, // Override interval for one-time payment
               features: data.planDetails.features,
               razorpaySubscriptionId: data.razorpayOrderId,
               razorpayCustomerId: 'fugfewgfewgfewkf',
               status: 'active',
               autoRenewal: false, // No auto-renewal for one-time payments
               currentPeriodStart,
               currentPeriodEnd, // Set expiry to 1 year from now
               paymentMethod: {
                    id: payment.method,
                    last4: payment.card?.last4 || '',
                    type: payment.card?.type || payment.method
               },
               renewalHistory: [{
                    date: new Date(),
                    status: payment.status === 'captured' ? 'success' : 'failed',
                    paymentId: payment.id,
                    amount: payment.amount / 100,
                    failureReason: payment.error_description
               }]
          };

          // 5. Save to subscription repository
          const activatedOrder = await this.subscriptionRepository.createSubscription(subscriptionData);

          return activatedOrder;
     }

     async handleWebhook(webhookSignature: string,event: any): Promise<any> {

                const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
                const generatedSignature = createHmac('sha256', webhookSecret)
                  .update(JSON.stringify(event))
                  .digest('hex');

               console.log(generatedSignature, webhookSignature)
          
                if (generatedSignature !== webhookSignature) {
                  throw new Error('Invalid webhook signature')
                }
          
                // Process the webhook event
                await this.razorpayRepository.handleWebhook(event);
          
     }
}