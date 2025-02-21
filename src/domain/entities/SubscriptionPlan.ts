export class SubscriptionPlan {
    constructor(
        public id: string,
        public name: string,
        public price: number,
        public interval: number, // Number of months
        public features: Array<{featureId: string; name: string; value: any }>, // Accepts boolean, number, or string
        public userType: "job_seeker" | "recruiter",
        public isActive: boolean = true // Default is true
    ) {}
}
