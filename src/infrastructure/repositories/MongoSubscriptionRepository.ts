import { SubscriptionRepository } from "../../domain/repositories/SubscriptionRepository";
import SubscriptionModel from "../database/models/SubscriptionModel";
import mongoose from "mongoose";

export class MongoSubscriptionRepository implements SubscriptionRepository {
  async createSubscription(data: any): Promise<any> {
    const subscription = new SubscriptionModel(data);
    return await subscription.save();
  }

  async findById(userId: string): Promise<any> {
    return await SubscriptionModel.findOne({ userId, status: "active" });
  }

  async findByRazorpayId(razorpaySubscriptionId: string): Promise<any> {
    return await SubscriptionModel.findOne({ razorpaySubscriptionId });
  }

  async updateStatus(id: string, status: string): Promise<any> {
    // If using Mongoose ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      return await SubscriptionModel.findByIdAndUpdate(
        id,
        { status, ...(status === 'cancelled' ? { cancelledAt: new Date() } : {}) },
        { new: true }
      );
    } 
    // If using Razorpay subscription ID
    else {
      return await SubscriptionModel.findOneAndUpdate(
        { razorpaySubscriptionId: id },
        { status, ...(status === 'cancelled' ? { cancelledAt: new Date() } : {}) },
        { new: true }
      );
    }
  }

  async updatePeriod(id: string, startDate: Date, endDate: Date): Promise<any> {
    return await SubscriptionModel.findByIdAndUpdate(
      id,
      { 
        currentPeriodStart: startDate,
        currentPeriodEnd: endDate
      },
      { new: true }
    );
  }

  async incrementBillingAttempts(id: string, failureReason: string): Promise<any> {
    return await SubscriptionModel.findByIdAndUpdate(
      id,
      { 
        $inc: { billingAttempts: 1 },
        failureReason
      },
      { new: true }
    );
  }

  async addRenewalRecord(renewalData: {
    subscriptionId: string,
    date: Date,
    status: "success" | "failed",
    paymentId: string,
    amount: number,
    failureReason?: string
  }): Promise<any> {
    const { subscriptionId, ...renewalRecord } = renewalData;
    
    return await SubscriptionModel.findByIdAndUpdate(
      subscriptionId,
      { 
        $push: { 
          renewalHistory: renewalRecord 
        } 
      },
      { new: true }
    );
  }

  async findExpiredSubscriptions(currentDate: Date): Promise<any[]> {
    // Find subscriptions that:
    // 1. Are currently active
    // 2. Have autoRenewal set to false (one-time payments)
    // 3. Have currentPeriodEnd date that has passed
    return await SubscriptionModel.find({
      status: "active",
      autoRenewal: false,
      currentPeriodEnd: { $lt: currentDate }
    });
  }

  async findSubscriptionsNearingExpiry(daysThreshold: number): Promise<any[]> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    
    // Find subscriptions that:
    // 1. Are currently active
    // 2. Have currentPeriodEnd date within the threshold period
    return await SubscriptionModel.find({
      status: "active",
      currentPeriodEnd: { 
        $gte: new Date(), 
        $lte: thresholdDate 
      }
    });
  }
}