export class Recruiter {
    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public mobile: string,
        public currentLocation: string,
        public profilePicture: string,
        public professionalDetails: {
            currentCompany: string;
            currentDesignation: string;
            employmentPeriod: {
                from: string;
                to: string | null;
            };
            companyAddress: {
                addressLine1: string;
                addressLine2?: string;
                city: string;
                state: string;
                country: string;
                zipCode: string;
            };
        },
        public accountStatus: string,
        public isBlocked: boolean,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
        public password?: string // optional because password might not be needed when showing profile
    ) {}
}

export class RecruiterProfile {
    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public mobile: string,
        public currentLocation: string,
        public profilePicture: string,
        public professionalDetails: {
            currentCompany: string;
            currentDesignation: string;
            employmentPeriod: {
                from: string;
                to: string | null;
            };
            companyAddress: {
                addressLine1: string;
                addressLine2?: string;
                city: string;
                state: string;
                country: string;
                zipCode: string;
            };
        },
        public accountStatus: string,
        public isBlocked: boolean,
        public createdAt?: Date,
        public updatedAt?: Date
    ) {}
}


