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
}>;
