// infrastructure/services/RazorpayService.ts
import Razorpay from 'razorpay';
import { createHmac } from 'crypto';
import { RazorpayRepository } from '../../domain/repositories/RazorpayRepository';
import { RazorpaySubscription } from '../../domain/entities/RazorpaySubscription';
import { MongoSubscriptionRepository } from '../../infrastructure/repositories/MongoSubscriptionRepository';

export class RazorpayService implements RazorpayRepository {
    private razorpay: Razorpay;

    constructor() {
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!
        });
    }

    async createSubscriptionPlan(planData: any): Promise<any> {
        try {
            return await this.razorpay.plans.create({
                period: 'monthly',
                interval: planData.interval,
                item: {
                    name: planData.name,
                    amount: planData.price * 100, // Convert to paise
                    currency: 'INR',
                    description: planData.description
                }
            });
        } catch (error) {
            throw new Error(`Failed to create Razorpay plan: ${error}`);
        }
    }

    async createSubscription(subscriptionData: any): Promise<any> {
        try {
            return this.razorpay.subscriptions.create(subscriptionData);

            // const subscription = await this.razorpay.subscriptions.create({
            //     plan_id: subscriptionData.planId,
            //     customer_notify: 1,
            //     total_count: subscriptionData.totalCount,
            //     addons: subscriptionData.addons,
            //     notes: {
            //         userId: subscriptionData.userId
            //     }
            // });

            // return new RazorpaySubscription(
            //     subscription.id,
            //     subscription.plan_id,
            //     subscription.id,
            //     subscriptionData.userId,
            //     subscription.status,
            //     new Date((subscription.current_end ?? 0) * 1000),
            //     new Date((subscription.current_start ?? 0) * 1000)
            // );
        } catch (error) {
            throw new Error(`Failed to create Razorpay subscription: ${error}`);
        }
    }

    async cancelSubscription(subscriptionId: string): Promise<boolean> {
        try {
            await this.razorpay.subscriptions.cancel(subscriptionId);
            return true;
        } catch (error) {
            throw new Error(`Failed to cancel subscription: ${error}`);
        }
    }

    async getSubscription(subscriptionId: string): Promise<RazorpaySubscription> {
        try {
            const subscription = await this.razorpay.subscriptions.fetch(subscriptionId);
            return new RazorpaySubscription(
                subscription.id,
                subscription.plan_id,
                subscription.id,
                String(subscription.notes?.userId ?? ""),
                subscription.status,
                new Date((subscription.current_end ?? 0) * 1000),
                new Date((subscription.current_start ?? 0) * 1000)
            );
        } catch (error) {
            throw new Error(`Failed to fetch subscription: ${error}`);
        }
    }

    async getPayment(PaymentId: string): Promise<any> {
        try {
            const payment = await this.razorpay.payments.fetch(PaymentId);

            return payment
        } catch (error) {
            throw new Error(`Failed to fetch subscription: ${error}`);
        }
    }

    async updateSubscriptionPlan(planId: string, planData: any): Promise<any> {
        try {
            // Create a new plan with updated details
            // Razorpay doesn't support direct plan updates, so we create a new one
            const newPlan = await this.razorpay.plans.create({
                period: 'monthly',
                interval: planData.interval,
                item: {
                    name: planData.name,
                    amount: planData.price * 100, // Convert to paise
                    currency: 'INR',
                    description: planData.description
                }
            });

            return newPlan;
        } catch (error) {
            throw new Error(`Failed to update Razorpay plan: ${error}`);
        }
    }

    async verifyPaymentSignature(paymentData: any): Promise<boolean> {
        try {
            const signature = paymentData.razorpaySignature;
            const orderId = paymentData.razorpaySubscriptionId;
            const paymentId = paymentData.razorpayPaymentId;
            let generatedSignature = null

            if (paymentData.autoRenewal) {
                generatedSignature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
                    .update(`${paymentId}|${orderId}`)
                    .digest('hex');
            } else {
                generatedSignature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
                    .update(`${orderId}|${paymentId}`)
                    .digest('hex');
            }



            console.log(generatedSignature, signature)

            return generatedSignature === signature;
        } catch (error) {
            throw new Error(`Signature verification failed: ${error}`);
        }
    }

    async createOrder(orderData: any): Promise<any> {
        try {
            return await this.razorpay.orders.create({
                amount: orderData.amount,
                currency: orderData.currency,
                notes: orderData.notes
            });
        } catch (error) {
            throw new Error(`Failed to create Razorpay order: ${error}`);
        }
    }

    // Enhanced webhook handler in RazorpayService.ts
    async handleWebhook(event: any): Promise<void> {
        const subscriptionRepository = new MongoSubscriptionRepository();
        console.log(`Received webhook event: ${event.event}`);

        try {
            switch (event.event) {
                // Subscription lifecycle events
                case 'subscription.authenticated':
                    // Initial authentication - subscription created but not yet active
                    console.log('Subscription authenticated:', event.payload.subscription.entity.id);
                    await subscriptionRepository.updateStatus(
                        event.payload.subscription.entity.id,
                        'pending_activation'
                    );
                    break;

                case 'subscription.activated':
                    // Subscription is now active
                    await subscriptionRepository.updateStatus(
                        event.payload.subscription.entity.id,
                        'active'
                    );
                    break;

                case 'subscription.charged':
                    // Auto-renewal successful - key event for renewals
                    const subscription = await subscriptionRepository.findByRazorpayId(
                        event.payload.subscription.entity.id
                    );

                    if (subscription) {
                        // Update current period dates
                        await subscriptionRepository.updatePeriod(
                            subscription._id,
                            new Date(event.payload.subscription.entity.current_start * 1000),
                            new Date(event.payload.subscription.entity.current_end * 1000)
                        );

                        // Add to renewal history
                        await subscriptionRepository.addRenewalRecord({
                            subscriptionId: subscription._id,
                            date: new Date(),
                            status: 'success',
                            paymentId: event.payload.payment.entity.id,
                            amount: event.payload.payment.entity.amount / 100
                        });
                    }
                    break;

                case 'subscription.halted':
                    // Payment failures led to subscription being halted
                    await subscriptionRepository.updateStatus(
                        event.payload.subscription.entity.id,
                        'halted'
                    );

                    const haltedSubscription = await subscriptionRepository.findByRazorpayId(
                        event.payload.subscription.entity.id
                    );

                    if (haltedSubscription) {
                        // Record the failure
                        await subscriptionRepository.addRenewalRecord({
                            subscriptionId: haltedSubscription._id,
                            date: new Date(),
                            status: 'failed',
                            paymentId: event.payload.payment?.entity?.id,
                            amount: event.payload.payment?.entity?.amount ? event.payload.payment.entity.amount / 100 : 0,
                            failureReason: 'Subscription halted after payment failures'
                        });
                    }
                    break;

                case 'subscription.paused':
                    // Subscription temporarily paused
                    await subscriptionRepository.updateStatus(
                        event.payload.subscription.entity.id,
                        'paused'
                    );
                    break;

                case 'subscription.resumed':
                    // Subscription resumed after being paused
                    await subscriptionRepository.updateStatus(
                        event.payload.subscription.entity.id,
                        'active'
                    );
                    break;

                case 'subscription.cancelled':
                    // Subscription cancelled (by user or merchant)
                    await subscriptionRepository.updateStatus(
                        event.payload.subscription.entity.id,
                        'cancelled'
                    );
                    break;

                case 'subscription.completed':
                    // Subscription reached its end date successfully
                    await subscriptionRepository.updateStatus(
                        event.payload.subscription.entity.id,
                        'completed'
                    );
                    break;

                case 'subscription.pending':
                    // Subscription created but payment pending
                    await subscriptionRepository.updateStatus(
                        event.payload.subscription.entity.id,
                        'pending'
                    );
                    break;

                case 'subscription.updated':
                    // Subscription details updated
                    console.log('Subscription updated:', event.payload.subscription.entity.id);
                    // You may want to sync the updated details with your database
                    break;

                // Handle related payment events for more detailed tracking
                case 'payment.failed':
                    // Handle individual payment failure
                    // This helps track failures before subscription is halted
                    const paymentFailedSubscriptionId = event.payload.payment.entity.subscription_id;
                    if (paymentFailedSubscriptionId) {
                        const affectedSubscription = await subscriptionRepository.findByRazorpayId(
                            paymentFailedSubscriptionId
                        );

                        if (affectedSubscription) {
                            // Increment billing attempts
                            await subscriptionRepository.incrementBillingAttempts(
                                affectedSubscription._id,
                                event.payload.payment.entity.error_description || 'Payment failed'
                            );

                            // Record the failed attempt
                            await subscriptionRepository.addRenewalRecord({
                                subscriptionId: affectedSubscription._id,
                                date: new Date(),
                                status: 'failed',
                                paymentId: event.payload.payment.entity.id,
                                amount: event.payload.payment.entity.amount / 100,
                                failureReason: event.payload.payment.entity.error_description || 'Payment failed'
                            });
                        }
                    }
                    break;
            }
        } catch (error) {
            console.error(`Error processing webhook ${event.event}:`, error);
            // Log the error to your monitoring system
        }
    }
}
