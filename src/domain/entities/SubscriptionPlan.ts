export class SubscriptionPlan {
    constructor(
        public id: string,
        public name: string,
        public price: number,
        public interval: number, 
        public features: Array<{featureId: string; name: string; value: any }>, 
        public userType: "job_seeker" | "recruiter",
        public razorpayPlanId: string, 
        public isActive: boolean = true 
    ) {}
}
