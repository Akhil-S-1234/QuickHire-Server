export class User {
    constructor(
        public id : string,
        public firstName : string,
        public lastName: string,
        public email : string,
        public phoneNumber?: string,
        public password?: string,
        public profilePicture?: string,
        public isBlocked?: Boolean,
        public createdAt : Date = new Date()
    ) {}
}

export class UserProfile {
    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public phoneNumber?: string,
        public profilePicture?: string,
        public isFresher?: boolean,
        public resume?: string,
        public skills?: string[],
        public experience?: Array<{
            id?: string;
            jobTitle: string;
            companyName: string;
            startDate: Date;
            endDate?: Date;
            description?: string;
        }>,
        public education?: Array<{
            id?: string;
            institution: string;
            degree: string;
            fieldOfStudy?: string;
            startDate: Date;
            endDate?: Date;
        }>,
        public city?: string,
        public state?: string,
        public isBlocked?: Boolean,
        public createdAt?: Date,
        public updatedAt?: Date,
        public subscription?: {
            type: string;         // e.g., 'monthly', 'yearly'
            startDate: Date;
            endDate: Date;
            isActive: boolean;    // indicates whether the subscription is active
        },
        public savedJobs?: string[],
    ) {}
}
