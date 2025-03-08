import { UserRepository } from '../../../domain/repositories/UserRepository'
import { SubscriptionPlanRepository } from '../../../domain/repositories/SubscriptionPlanRepository'
import moment from 'moment';  // You can use 'moment' or native Date functions for date manipulation
import { SubscriptionPlan } from '../../../domain/entities/SubscriptionPlan';
import { NullFilterOption } from 'aws-sdk/clients/quicksight';


export class SubscriptionPlanUseCase {
    constructor(
        private userRepository: UserRepository,
        private subscriptionPlanRepository: SubscriptionPlanRepository
    ) { }

    

    async getSubscriptionDetails(email: string): Promise<any> {
        return this.userRepository.getSubscriptionDetails(email)
    }

    async getSubscriptionPlans(userType: string): Promise<any> {
        return this.subscriptionPlanRepository.getAllSubscriptionPlans(userType);
    }

    async getSubscriptionPlanById(subscriptionPlanId: string): Promise<SubscriptionPlan | null> {
        return this.subscriptionPlanRepository.getSubscriptionPlanById(subscriptionPlanId)
    }

}


