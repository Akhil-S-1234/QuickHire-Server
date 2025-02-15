import { HttpStatus } from '../../../utils/HttpStatus'
import { createResponse } from '../../../utils/CustomResponse';
import { RequestHandler, Request, Response } from 'express';
import { UserJobUseCase } from '../../../application/use-cases/User/UserJobUseCase'


export class UserJobController {

    constructor(
        private userJobUseCase: UserJobUseCase
    ) { }



    getActiveJobs: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {

            // Fetch active jobs using the use case
            const activeJobs = await this.userJobUseCase.getActiveJobs();


            console.log(activeJobs)
            if (!activeJobs || activeJobs.length === 0) {
                res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'No active jobs found', null));
                return
            }

            res.status(HttpStatus.OK).json(createResponse('success', 'Active jobs retrieved successfully', activeJobs));
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to fetch active jobs', error.message));
        }
    };



    getJobDetails: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { jobId } = req.params

        try {
            // Fetch jobs associated with the recruiter (email)
            const job = await this.userJobUseCase.getJobDetails(jobId);

            if (!job || job.length === 0) {
                res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'No jobs found', null));
                return
            }

            res.status(HttpStatus.OK).json(createResponse('success', 'Jobs retrieved successfully', job));
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to fetch jobs', error.message));
        }
    }

    applyJob: RequestHandler = async (req: Request, res: Response): Promise<void> => {

        const { jobId } = req.params
        const email = (req as Request & { user?: string }).user

        if (!jobId || !email) {
            res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'Invalid jobId or email', null))
            return
        }

        try {

            const newApplication = await this.userJobUseCase.applyToJob(email, jobId)

            if (!newApplication) {
                res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'Failed to create new job application', null))
                return
            }

            res.status(HttpStatus.CREATED).json(createResponse('success', 'New Job application created successfully', newApplication))

        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to create job', error.message));
        }
    }

    getAppliedJobs: RequestHandler = async (req: Request, res: Response): Promise<void> => {

        const email = (req as Request & { user?: string }).user

        if (!email) {
            res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'Invalid email', null))
            return
        }

        try {

            const appliedJobs = await this.userJobUseCase.appliedJobs(email)

            if (!appliedJobs) {
                res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'Failed to get applied jobs', null))
                return
            }

            console.log(appliedJobs)

            res.status(HttpStatus.OK).json(createResponse('success', 'Job fetched successfully', appliedJobs))

        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to create job', error.message));

        }
    }

}
