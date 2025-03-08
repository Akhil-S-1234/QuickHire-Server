
// domain/entities/RazorpaySubscription.ts
export class RazorpaySubscription {
    constructor(
        public readonly id: string,
        public readonly planId: string,
        public readonly subscriptionId: string,
        public readonly userId: string,
        public readonly status: string,
        public readonly currentEnd: Date,
        public readonly currentStart: Date
    ) {}
}