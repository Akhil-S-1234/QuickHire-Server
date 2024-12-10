import { HttpStatus} from '../../../utils/HttpStatus'
import { createResponse } from '../../../utils/CustomResponse';
import { RequestHandler, Request, Response  } from 'express';
import { RecruiterJobUseCase } from '../../../application/use-cases/Recruiter/RecruiterJobUseCase';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';

export class RecruiterJobController {
    constructor(
private recruiterJobUseCase: RecruiterJobUseCase
    ) { }

    postJob : RequestHandler = async ( req: Request, res: Response ): Promise<void> => {

        const { job } = req.body

        const email = (req as Request & { user?: string }).user;

        const jobWithPostBy = {
            ...job,
            postedBy: email,
        };


        if(!job){
            res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'Job details not found', null))
        }
        try {
            const createdJob = await this.recruiterJobUseCase.execute(jobWithPostBy);
            res.status(HttpStatus.CREATED).json(createResponse('success', 'Job created successfully', createdJob));
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to create job', error.message));
        }

        
    }

    getJob: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const email = (req as Request & { user?: string }).user;

        if (!email) {
            res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'Recruiter not authenticated', null));
            return;
        }

        try {
            // Fetch jobs associated with the recruiter (email)
            const jobs = await this.recruiterJobUseCase.getJobsByRecruiter(email);

            if (!jobs || jobs.length === 0) {
                 res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'No jobs found', null));
                 return
            }

            res.status(HttpStatus.OK).json(createResponse('success', 'Jobs retrieved successfully', jobs));
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to fetch jobs', error.message));
        }
}

changeJobStatus: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { jobId } = req.params; // Job ID from the URL parameter
    const { isActive } = req.body;  // New status from the request body

    console.log(isActive, jobId)
    // Validate the input
    if (!jobId ){
         res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Job ID and status are required', null));
         return
    }

    try {
        // Call the use case to change the job status
        const updatedJob = await this.recruiterJobUseCase.changeJobStatus(jobId, isActive);

        console.log(updatedJob)

        if (!updatedJob) {
             res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'Job not found', null));
             return
        }

        res.status(HttpStatus.OK).json(createResponse('success', 'Job status updated successfully', updatedJob));
    } catch (error: any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to update job status', error.message));
    }
};

getActiveJobs: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        
        console.log('h')

        // Fetch active jobs using the use case
        const activeJobs = await this.recruiterJobUseCase.getActiveJobs();


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

}