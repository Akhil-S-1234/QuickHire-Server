import { Subscription } from '../entities/Subscription';

export interface SubscriptionRepository {
    getAllSubscriptions(userType?: string): Promise<Subscription[]>;
    updateSubscriptionPrice(subscriptionId: string, price: number): Promise<Subscription | null>;
    findById(subscriptionId: string): Promise<Subscription | null>;
}