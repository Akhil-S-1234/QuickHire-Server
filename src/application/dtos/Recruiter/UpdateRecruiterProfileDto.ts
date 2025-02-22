export type UpdateRecruiterDto = Partial<{
    name: string;
    email: string;
    phone: string;
    position: string;
    companyName: string;
    password: string;
    profilePicture: string;
    accountStatus: string;
    isBlocked: Boolean;
    createdAt: Date
}>