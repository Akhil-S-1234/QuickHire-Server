import { RequestHandler, Request, Response } from 'express';
import { UserProfileUseCase } from '../../../application/use-cases/User/UserProfileUseCase';
import { HttpStatus } from '../../../utils/HttpStatus';
import { createResponse } from '../../../utils/CustomResponse';
import { UpdateUserDTO } from '../../../application/dtos/User/UpdateUserProfileDto'

export class UserProfileController {
    constructor(
        private userProfileUseCase: UserProfileUseCase
    ) { }

    getProfile: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const email = (req as Request & { user?: string }).user;


            if (!email) {
                res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'User not authenticated', null));
                return;
            }

            // Fetch user profile using the use case
            const userProfile = await this.userProfileUseCase.execute(email);

            res.status(HttpStatus.OK).json(createResponse('success', 'User profile fetched successfully', userProfile));
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', error.message, null));
        }
    };

    updateProfile: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const email = (req as Request & { user?: string }).user;

            if (!email) {
                res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'User not authenticated', null));
                return;
            }

            // Parse the updates from request body and validate using UpdateUserProfileDto
            const updates: UpdateUserDTO = req.body;

            // Execute the use case to update the user profile
            const updatedProfile = await this.userProfileUseCase.update(email, updates);

            if (!updatedProfile) {
                res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'User not found', null));
                return;
            }

            console.log(updatedProfile)

            res.status(HttpStatus.OK).json(createResponse('success', 'User profile updated successfully', updatedProfile));
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', error.message, null));
        }
    };

    addSkill = async (req: Request, res: Response): Promise<void> => {
        try {
            const email = (req as Request & { user?: string }).user;  // Assume email is in req.user
            const { skill } = req.body; // Get the skill from the request body

            if (!email) {
                res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'User not authenticated', null));
                return;
            }

            if (!skill) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Skill is required', null));
                return;
            }

            // Call the use case to add the skill
            const updatedProfile = await this.userProfileUseCase.addSkill(email, skill);

            res.status(HttpStatus.OK).json(createResponse('success', 'Skill added successfully', updatedProfile));
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', error.message, null));
        }
    };

    removeSkill: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const email = (req as Request & { user?: string }).user;  // Assume email is in req.user
            const { skill } = req.params; 

            if (!email) {
                res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'User not authenticated', null));
                return;
            }

            if (!skill) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Skill is required', null));
                return;
            }

            const updatedProfile = await this.userProfileUseCase.removeSkill(email, skill);

            if (!updatedProfile) {
                res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'User or skill not found', null));
                return;
            }

            res.status(HttpStatus.OK).json(createResponse('success', 'Skill removed successfully', updatedProfile));
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', error.message, null));
        }
    };

    addProfilePicture: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const email = (req as Request & { user?: string }).user; // Extract the email from the authenticated user

            const image = (req as Request & { Url?: string }).Url

            console.log(email)
            console.log(image)

            if (!email) {
                res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'User not authenticated', null));
                return
            }

            if (!image) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Profile picture upload failed', null));
                return
            }

            // Assuming you have a method to update the user profile with the image URL
            const updatedProfile = await this.userProfileUseCase.update(email, { profilePicture: image });

            if (!updatedProfile) {
                res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'User not found', null));
                return
            }

            res.status(HttpStatus.OK).json(createResponse('success', 'Profile picture uploaded successfully', updatedProfile));
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', error.message, null));
        }
    }

    addresume: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const email = (req as Request & { user?: string }).user; // Extract the email from the authenticated user

            const resume = (req as Request & { Url?: string }).Url

            if (!email) {
                res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'User not authenticated', null));
                return
            }

            if (!resume) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Resume upload failed', null));
                return
            }

            // Assuming you have a method to update the user profile with the image URL
            const updatedProfile = await this.userProfileUseCase.update(email, { resume: resume });

            if (!updatedProfile) {
                res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'User not found', null));
                return
            }

            res.status(HttpStatus.OK).json(createResponse('success', 'Resume uploaded successfully', updatedProfile));
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', error.message, null));
        }
    }

    addEducation = async (req: Request, res: Response): Promise<void> => {
        try {
            const email = (req as Request & { user?: string }).user;  // Assume email is in req.user
            const { education } = req.body; // Get the skill from the request body

            if (!email) {
                res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'User not authenticated', null));
                return;
            }

            if (!education) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Education is required', null));
                return;
            }

            // Call the use case to add the skill
            const updatedProfile = await this.userProfileUseCase.addEducation(email, education);

            res.status(HttpStatus.OK).json(createResponse('success', 'Education added successfully', updatedProfile));
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', error.message, null));
        }
    };

    removeEducation = async (req: Request, res: Response): Promise<void> => {
        try {
            const email = (req as Request & { user?: string }).user
            const { educationId } = req.params

            if (!email) {
                res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'User not authenticated', null));
                return;
            }

            if (!educationId) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Education ID is required to remove', null));
                return;
            }

            const updatedProfile = await this.userProfileUseCase.removeEducation(email, educationId)

            res.status(HttpStatus.OK).json(createResponse('success', 'Education removed successfully', updatedProfile));

        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', error.message, null));

        }
    }

    addExperience = async (req: Request, res: Response): Promise<void> => {
        try {
            const email = (req as Request & { user?: string }).user;  // Assume email is in req.user
            const { experience } = req.body; // Get the skill from the request body

            if (!email) {
                res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'User not authenticated', null));
                return;
            }

            if (!experience) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Experience is required', null));
                return;
            }

            const updatedProfile = await this.userProfileUseCase.addExperience(email, experience);

            res.status(HttpStatus.OK).json(createResponse('success', 'Experience added successfully', updatedProfile));
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', error.message, null));
        }
    };

    removeExperience = async (req: Request, res: Response): Promise<void> => {
        try {
            const email = (req as Request & { user?: string }).user
            const { experienceId } = req.params

            if (!email) {
                res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'User not authenticated', null));
                return;
            }

            if (!experienceId) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Experience ID is required to remove', null));
                return;
            }

            const updatedProfile = await this.userProfileUseCase.removeExperience(email, experienceId)

            res.status(HttpStatus.OK).json(createResponse('success', 'Experience removed successfully', updatedProfile));

        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', error.message, null));

        }
    }

}
