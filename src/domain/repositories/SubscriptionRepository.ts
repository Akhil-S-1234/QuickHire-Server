export interface SubscriptionRepository {
    createSubscription(data: any): Promise<any>;
    findById(id: string): Promise<any>;
    findByRazorpayId(razorpaySubscriptionId: string): Promise<any>;
    updateStatus(id: string, status: string): Promise<any>;
    updatePeriod(id: string, startDate: Date, endDate: Date): Promise<any>;
    incrementBillingAttempts(id: string, failureReason: string): Promise<any>;
    addRenewalRecord(renewalData: {
        subscriptionId: string,
        date: Date,
        status: "success" | "failed",
        paymentId: string,
        amount: number,
        failureReason?: string
    }): Promise<any>;
    findExpiredSubscriptions(currentDate: Date): Promise<any[]>;
    findSubscriptionsNearingExpiry(daysThreshold: number): Promise<any[]>;
}