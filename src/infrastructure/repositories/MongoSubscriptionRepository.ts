
// MongoSubscriptionRepository.ts
import { SubscriptionRepository } from '../../domain/repositories/SubscriptionRepository';
import { Subscription } from '../../domain/entities/Subscription';
import SubscriptionModel from '../database/models/SubscriptionModel';

export class MongoSubscriptionRepository implements SubscriptionRepository {
    async getAllSubscriptions(userType?: string): Promise<Subscription[]> {
        const query = userType ? { userType } : {};
        const subscriptions = await SubscriptionModel.find(query);
        return subscriptions;
    }

    async updateSubscriptionPrice(subscriptionId: string, price: number): Promise<Subscription | null> {
        const updatedSubscription = await SubscriptionModel.findOneAndUpdate(
            { id: subscriptionId },
            { $set: { price } },
            { new: true }
        );
        return updatedSubscription;
    }

    async findById(subscriptionId: string): Promise<Subscription | null> {
        const subscription = await SubscriptionModel.findOne({ id: subscriptionId });
        return subscription;
    }
}
