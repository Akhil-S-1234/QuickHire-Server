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

    async verifyPayment(type: any, email: any): Promise<boolean> {

        const startDate = new Date();

        let endDate: Date;
        if (type === 'monthly') {
            endDate = moment(startDate).add(1, 'months').toDate();  
        } else if (type === 'yearly') {
            endDate = moment(startDate).add(1, 'years').toDate();  
        } else {
            throw new Error('Invalid subscription type');
        }

        const subscription = {
            type: type,
            startDate: startDate,
            endDate: endDate,
            isActive: true
        };

        return this.userRepository.verifyPayment(subscription, email);
    }

    async createPayment(paymentData: any): Promise<any> {
        return this.userRepository.createPayment(paymentData);
    }

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


