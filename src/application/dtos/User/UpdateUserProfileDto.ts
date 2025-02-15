// src/application/dtos/UpdateUserProfileDto.ts

//  interface UpdateUserProfileDto {
//     firstName?: string;
//     lastName?: string;
//     phoneNumber?: string;
//     profilePicture?: string;
//     isFresher?: boolean;
//     resume?: string;
//     skills?: string[];
//     experience?: Array<{
//         jobTitle: string;
//         companyName: string;
//         startDate: Date;
//         endDate?: Date;
//         description?: string;
//     }>;
//     education?: Array<{
//         institution: string;
//         degree: string;
//         fieldOfStudy?: string;
//         startDate: Date;
//         endDate?: Date;
//     }>;
//     city?: string;
//     state?: string;
// }

export type UpdateUserDTO = Partial<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePicture: string;
    isFresher: boolean;
    resume: string;
    skills: string[];
    experience: Array<{
        jobTitle: string;
        companyName: string;
        startDate: Date;
        endDate?: Date;
        description?: string;
    }>;
    education: Array<{
        institution: string;
        degree: string;
        fieldOfStudy?: string;
        startDate: Date;
        endDate?: Date;
    }>;
    city: string;
    state: string;
    isBlocked: Boolean;
    subscription?: {
        type: string;         // e.g., 'monthly', 'yearly'
        startDate: Date;
        endDate: Date;
        isActive: boolean;    // indicates whether the subscription is active
    };
    savedJobs?: string[]; // Array of references to the Job model
    password?: string;
}>;
