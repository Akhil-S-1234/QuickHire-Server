export class Recruiter {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public phone?: string,
        public position?: string,
        public companyName?: string,
        public password?: string,
        public isBlocked?: Boolean,
        public createdAt: Date = new Date()
    ) {}
}

export class RecruiterProfile {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public phone: string,
        public position: string,
        public companyName: string,
        public profilePicture: string,
        public isBlocked: Boolean,
        public createdAt?: Date,
        public updatedAt?: Date
    ) {}

}

