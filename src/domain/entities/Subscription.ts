export class Subscription {
    constructor(
        public id: string,
        public name: string,
        public price: number,
        public interval: 'monthly' | 'yearly',
        public features: Array<{ id: string; name: string }>,
        public userType: 'job_seeker' | 'recruiter'
    ) {}
}