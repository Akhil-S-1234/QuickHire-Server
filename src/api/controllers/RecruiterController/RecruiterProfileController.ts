import { RequestHandler, Request, Response } from 'express';
import { RecruiterProfileUseCase  } from '../../../application/use-cases/Recruiter/RecruiterProfileUseCase';
import { HttpStatus } from '../../../utils/HttpStatus';
import { createResponse } from '../../../utils/CustomResponse';
import { RecruiterDTO } from '../../../application/dtos/Recruiter/RecruiterProfileDto'

export class RecruiterProfileController {
    constructor(
        private recruiterProfileUseCase: RecruiterProfileUseCase
    ) { }

    getProfile: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const email = (req as Request & { user?: string }).user;

            console.log(email)

            if (!email) {
                res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'User not authenticated', null));
                return;
            }

            // Fetch user profile using the use case
            const recruiterProfile = await this.recruiterProfileUseCase.execute(email);

            console.log(recruiterProfile)

            res.status(HttpStatus.OK).json(createResponse('success', 'User profile fetched successfully', recruiterProfile));
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
            const updates: RecruiterDTO = req.body;

            // Execute the use case to update the user profile
            const updatedProfile = await this.recruiterProfileUseCase.update(email, updates);

            if (!updatedProfile) {
                res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'User not found', null));
                return;
            }

            res.status(HttpStatus.OK).json(createResponse('success', 'User profile updated successfully', updatedProfile));
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', error.message, null));
        }
    };

}