import { SubscriptionPlanRepository } from "../../domain/repositories/SubscriptionPlanRepository";
import { SubscriptionPlan } from "../../domain/entities/SubscriptionPlan";
import SubscriptionPlanModel from "../database/models/SubscriptionPlanModel";
import { SubscriptionPlanDTO } from "@application/dtos/Admin/SubscriptionPlanDto";

export class MongoSubscriptionPlanRepository implements SubscriptionPlanRepository {

    async createSubscriptionPlan(subscriptionPlanData: SubscriptionPlanDTO): Promise<SubscriptionPlan> {
        const newSubscriptionPlan = new SubscriptionPlanModel(subscriptionPlanData);
        const savedSubscriptionPlan = await newSubscriptionPlan.save();
        return this.toDomain(savedSubscriptionPlan);
    }

    async getAllSubscriptionPlans(userType?: string): Promise<SubscriptionPlan[]> {
        const query = userType ? { userType } : {};
        const subscriptionPlans = await SubscriptionPlanModel.find(query);
        return subscriptionPlans.map(this.toDomain);
    }

    async updateSubscriptionPlan(subscriptionPlanId: string, subscriptionPlanData: SubscriptionPlanDTO): Promise<SubscriptionPlan | null> {
        console.log(subscriptionPlanData)
        const updatedSubscriptionPlan = await SubscriptionPlanModel.findOneAndUpdate(
            { _id: subscriptionPlanId }, // Use _id instead of id
            { $set: { ...subscriptionPlanData } },
            { new: true }
        );
        console.log(updatedSubscriptionPlan)
        return updatedSubscriptionPlan ? this.toDomain(updatedSubscriptionPlan) : null;
    }

    async getSubscriptionPlanById(subscriptionPlanId: string): Promise<SubscriptionPlan | null> {
        const subscriptionPlan = await SubscriptionPlanModel.findById(subscriptionPlanId);
        return subscriptionPlan ? this.toDomain(subscriptionPlan) : null;
    }

    async deleteSubscriptionPlan(subscriptionPlanId: string): Promise<boolean> {
        const deletedSubscriptionPlan = await SubscriptionPlanModel.findByIdAndDelete(subscriptionPlanId);
        return !!deletedSubscriptionPlan; // Returns true if deleted, false if not found
    }

    async checkDuplicateSubscriptionPlan(userType: string, price: number, interval: number, name: string, subscriptionPlanId?: string): Promise<{ isPriceDuplicate: boolean; isIntervalDuplicate: boolean, isNameDuplicate: boolean }> {
        const filter: any = { userType, $or: [{ price }, { interval }, { name }] };

        if (subscriptionPlanId) {
            filter._id = { $ne: subscriptionPlanId }; // Exclude current subscription when updating
        }

        const existingSubscriptionPlans = await SubscriptionPlanModel.findOne(filter);

        return {
            isPriceDuplicate: !!existingSubscriptionPlans && existingSubscriptionPlans.price === price,
            isIntervalDuplicate: !!existingSubscriptionPlans && existingSubscriptionPlans.interval === interval,
            isNameDuplicate: !!existingSubscriptionPlans && existingSubscriptionPlans.name === name,
        };
    }

    private toDomain(subscriptionPlanDoc: any): SubscriptionPlan {
        return new SubscriptionPlan(
            subscriptionPlanDoc._id.toString(), // Convert ObjectId to string
            subscriptionPlanDoc.name,
            subscriptionPlanDoc.price,
            subscriptionPlanDoc.interval, // Number of months
            subscriptionPlanDoc.features.map((feature: any) => ({
                featureId: feature.featureId,
                name: feature.name,
                value: feature.value
            })),
            subscriptionPlanDoc.userType,
            subscriptionPlanDoc.isActive ?? true // Default to true if undefined
        );
    }
}
