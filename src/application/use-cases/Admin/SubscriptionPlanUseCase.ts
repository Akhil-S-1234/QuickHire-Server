// GetSubscriptionsUseCase.ts
import { SubscriptionPlanRepository } from '../../../domain/repositories/SubscriptionPlanRepository';
import { RazorpayRepository } from '../../../domain/repositories/RazorpayRepository';
import { SubscriptionPlan } from '../../../domain/entities/SubscriptionPlan';
import { SubscriptionPlanDTO } from '../../dtos/Admin/SubscriptionPlanDto'

export class SubscriptionPlanUseCase {
    constructor(
        private subscriptionPlanRepository: SubscriptionPlanRepository,
        private razorpayRepository: RazorpayRepository
    ) {}

    async execute(userType?: string): Promise<SubscriptionPlan[]> {
        return await this.subscriptionPlanRepository.getAllSubscriptionPlans(userType);
    }

    async create(subscriptionPlanData: SubscriptionPlanDTO  ): Promise<SubscriptionPlan | null> {

        this.validateSubscriptionPlanData(subscriptionPlanData);
        await this.checkDuplicateSubscriptionPlan(subscriptionPlanData); 

        const razorpayPlan = await this.razorpayRepository.createSubscriptionPlan({
            name: subscriptionPlanData.name,
            price: subscriptionPlanData.price,
            interval: subscriptionPlanData.interval,
            description: subscriptionPlanData.features.map(f => f.name).join(', ')
        });

        const enrichedPlanData = {
            ...subscriptionPlanData,
            razorpayPlanId: razorpayPlan.id
        };

        return await this.subscriptionPlanRepository.createSubscriptionPlan(enrichedPlanData);
    }

    async update(subscriptionPlanId: string, subscriptionPlanData: SubscriptionPlanDTO): Promise<SubscriptionPlan | null> {

        const existingPlan = await this.subscriptionPlanRepository.getSubscriptionPlanById(subscriptionPlanId);
        
        if (!existingPlan) {
            throw new Error('Subscription plan not found');
        }

        this.validateSubscriptionPlanData(subscriptionPlanData);
        await this.checkDuplicateSubscriptionPlan(subscriptionPlanData, subscriptionPlanId); 

        const razorpayPlan = await this.razorpayRepository.updateSubscriptionPlan(
            existingPlan.razorpayPlanId,
            {
                name: subscriptionPlanData.name,
                price: subscriptionPlanData.price,
                interval: subscriptionPlanData.interval,
                description: subscriptionPlanData.features.map(f => f.name).join(', ')
            }
        );

        // Update plan data with new Razorpay plan ID
        const enrichedPlanData = {
            ...subscriptionPlanData,
            razorpayPlanId: razorpayPlan.id,
        };
        
        return await this.subscriptionPlanRepository.updateSubscriptionPlan(subscriptionPlanId, enrichedPlanData);
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
