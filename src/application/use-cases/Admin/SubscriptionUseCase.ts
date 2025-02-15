// GetSubscriptionsUseCase.ts
import { SubscriptionRepository } from '../../../domain/repositories/SubscriptionRepository';
import { Subscription } from '../../../domain/entities/Subscription';

export class SubscriptionUseCase {
    constructor(private subscriptionRepository: SubscriptionRepository) {}

    async execute(userType?: string): Promise<Subscription[]> {
        return this.subscriptionRepository.getAllSubscriptions(userType);
    }

    async update(subscriptionId: string, price: number): Promise<Subscription | null> {
        return this.subscriptionRepository.updateSubscriptionPrice(subscriptionId, price);
    }
}
