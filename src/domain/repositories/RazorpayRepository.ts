// domain/repositories/RazorpayRepository.ts
import { RazorpaySubscription } from '../entities/RazorpaySubscription';

export interface RazorpayRepository {
    createSubscriptionPlan(planData: any): Promise<any>;
    updateSubscriptionPlan(planId: string, planData: any): Promise<any>;
    createSubscription(subscriptionData: any): Promise<any>;
    cancelSubscription(subscriptionId: string): Promise<boolean>;
    getSubscription(subscriptionId: string): Promise<RazorpaySubscription>;
    getPayment(PaymentId: string): Promise<any>;
    verifyPaymentSignature(paymentData: any): Promise<boolean>;
    createOrder(orderData: any): Promise<any> 
    handleWebhook(event: any): Promise<void> 
}