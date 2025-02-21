// GetSubscriptionsUseCase.ts
import { SubscriptionPlanRepository } from '../../../domain/repositories/SubscriptionPlanRepository';
import { SubscriptionPlan } from '../../../domain/entities/SubscriptionPlan';
import { SubscriptionPlanDTO } from '../../dtos/Admin/SubscriptionPlanDto'

export class SubscriptionPlanUseCase {
    constructor(private subscriptionPlanRepository: SubscriptionPlanRepository) {}

    async execute(userType?: string): Promise<SubscriptionPlan[]> {
        return await this.subscriptionPlanRepository.getAllSubscriptionPlans(userType);
    }

    async update(subscriptionPlanId: string, subscriptionPlanData: SubscriptionPlanDTO): Promise<SubscriptionPlan | null> {

        this.validateSubscriptionPlanData(subscriptionPlanData);
        await this.checkDuplicateSubscriptionPlan(subscriptionPlanData, subscriptionPlanId); 
        return await this.subscriptionPlanRepository.updateSubscriptionPlan(subscriptionPlanId, subscriptionPlanData);
    }

    async create(subscriptionPlanData: SubscriptionPlanDTO  ): Promise<SubscriptionPlan | null> {

        this.validateSubscriptionPlanData(subscriptionPlanData);
        await this.checkDuplicateSubscriptionPlan(subscriptionPlanData); 
        return await this.subscriptionPlanRepository.createSubscriptionPlan(subscriptionPlanData);
    }

    async delete(subscriptionPlanId: string): Promise<boolean> {

        const subscriptionPlan = await this.subscriptionPlanRepository.getSubscriptionPlanById(subscriptionPlanId);
        if (!subscriptionPlan) {
            return false; // SubscriptionPlan not found
        }
    
        await this.subscriptionPlanRepository.deleteSubscriptionPlan(subscriptionPlanId);
        return true; // SubscriptionPlan deleted successfully
    }
    

    private validateSubscriptionPlanData(subscriptionPlanData: SubscriptionPlanDTO): void {
        const { name, price, interval, userType, features } = subscriptionPlanData;

        if (!name || !price || !interval || !userType) {
            throw new Error('Invalid subscriptionPlan data. All required fields must be provided.');
        }

        if (!Array.isArray(features) || features.length === 0) {
            throw new Error('SubscriptionPlan must have at least one feature.');
        }
    }

    private async checkDuplicateSubscriptionPlan(subscriptionPlanData: SubscriptionPlanDTO, subscriptionPlanId?: string): Promise<void> {
        const { userType, price, interval, name } = subscriptionPlanData;

        const { isPriceDuplicate, isIntervalDuplicate, isNameDuplicate } =
            await this.subscriptionPlanRepository.checkDuplicateSubscriptionPlan(userType, price, interval, name, subscriptionPlanId);

        if (isPriceDuplicate) {
            throw new Error('A subscriptionPlan with this price already exists for the selected user type.');
        }

        if (isIntervalDuplicate) {
            throw new Error('A subscriptionPlan with this interval already exists for the selected user type.');
        }

        if (isNameDuplicate) {
            throw new Error('A subscriptionPlan with this name already exists for the selected user type.');
        }
    }
    
}
