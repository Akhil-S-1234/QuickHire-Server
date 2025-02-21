import { SubscriptionPlan } from '../entities/SubscriptionPlan';
import { SubscriptionPlanDTO } from '@application/dtos/Admin/SubscriptionPlanDto';

export interface SubscriptionPlanRepository {
    createSubscriptionPlan(subscriptionPlanData: SubscriptionPlanDTO): Promise<SubscriptionPlan>
    getAllSubscriptionPlans(userType?: string): Promise<SubscriptionPlan[]>;
    updateSubscriptionPlan(subscriptionPlanId: string, subscriptionPlanData: SubscriptionPlanDTO): Promise<SubscriptionPlan | null>;
    deleteSubscriptionPlan(subscriptionPlanId: string): Promise<boolean>
    getSubscriptionPlanById(subscriptionPlanId: string): Promise<SubscriptionPlan | null>;
    checkDuplicateSubscriptionPlan(userType: string, price: number, interval: number, name: string, subscriptionPlanId?: string): Promise<{ isPriceDuplicate: boolean; isIntervalDuplicate: boolean, isNameDuplicate: boolean }> 
}