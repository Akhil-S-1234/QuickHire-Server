import { UserRepository } from '../../../domain/repositories/UserRepository'
import moment from 'moment';  // You can use 'moment' or native Date functions for date manipulation


export class SubscriptionUseCase {
    constructor(private userRepository: UserRepository) { }

    async verifyPayment(type: any, email: any): Promise<boolean> {

        const startDate = new Date();

        // Calculate the end date based on the subscription type
        let endDate: Date;
        if (type === 'monthly') {
            endDate = moment(startDate).add(1, 'months').toDate();  // Add 1 month for monthly subscription
        } else if (type === 'yearly') {
            endDate = moment(startDate).add(1, 'years').toDate();  // Add 1 year for yearly subscription
        } else {
            throw new Error('Invalid subscription type');
        }

        // Update the user's subscription information
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
}


