import { HttpStatus } from '../../../utils/HttpStatus'
import { createResponse } from '../../../utils/CustomResponse';
import { RequestHandler, Request, Response } from 'express';
import { SavedJobsUseCase } from '../../../application/use-cases/User/SavedJobsUseCase';

export class UserSavedJobsController {

    constructor(
        private savedJobsUseCase: SavedJobsUseCase
    ) { }

    saveJob: RequestHandler = async (req: Request, res: Response): Promise<any> => {

        const email = (req as Request & { user?: string }).user;
        const jobId = req.params.jobId;

        if (!jobId || !email) {
            res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'Invalid jobId or email', null))
            return
        }

        try {

            await this.savedJobsUseCase.saveJob(email, jobId);
            return res.status(HttpStatus.OK).json(createResponse('success', 'Job saved successfully', null));

        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to save job', error.message));
        }

        
    }

    getSavedJobs: RequestHandler = async (req: Request, res: Response): Promise<any> => {
        const email = (req as Request & { user?: string }).user;

        if (!email) {
            res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'User is not authorized', null));
            return;
        }

        try {
            // Fetch the saved jobs for the user
            const savedJobs = await this.savedJobsUseCase.getSavedJobs(email);

            return res.status(HttpStatus.OK).json(createResponse('success', 'Saved jobs fetched successfully', savedJobs));

        } catch (error: any) {
            console.error('Error fetching saved jobs:', error); // Log the error for debugging
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to fetch saved jobs', error.message));
        }

    }

    removeSavedJob: RequestHandler = async (req: Request, res: Response): Promise<any> => {
        const email = (req as Request & { user?: string }).user;
        const jobId = req.params.jobId;
    
        // Validate input
        if (!jobId || !email) {
            res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Invalid jobId or email', null));
            return;
        }
    
        try {
            // Call the use case to remove the saved job
            await this.savedJobsUseCase.removeSavedJob(email, jobId);
            return res.status(HttpStatus.OK).json(createResponse('success', 'Job removed successfully from saved jobs', null));
        } catch (error: any) {
            console.error(`Error removing saved job: ${error.message}`); // Log the error
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to remove saved job', error.message));
        }
    };
    

    isJobSaved: RequestHandler = async (req: Request, res: Response): Promise<any> => {
        const email = (req as Request & { user?: string }).user;
        const jobId = req.params.jobId;
    
        // Validate input
        if (!jobId || !email) {
            res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Invalid jobId or email', null));
            return;
        }
    
        try {
            // Call the use case to remove the saved job
            const isJobSaved = await this.savedJobsUseCase.isJobSaved(email, jobId);
            return res.status(HttpStatus.OK).json(createResponse('success', 'Job status fetched successfully', isJobSaved));
        } catch (error: any) {
            console.error(`Error removing saved job: ${error.message}`); // Log the error
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to fetch saved job', error.message));
        }
    }

}