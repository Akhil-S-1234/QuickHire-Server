export interface FeatureDTO {
    featureId: string;
    name: string;
    value: string;
}

export interface SubscriptionPlanDTO {
    name: string;
    price: number;
    interval: number;
    userType: 'recruiter' | 'jobSeeker' | 'admin'; // Adjust as per allowed user types
    razorpayPlanId?: string;
    features: FeatureDTO[];
}
