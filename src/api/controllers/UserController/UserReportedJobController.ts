import { HttpStatus } from '../../../utils/HttpStatus'
import { createResponse } from '../../../utils/CustomResponse';
import { RequestHandler, Request, Response } from 'express';
import { ReportedJobUseCase } from '../../../application/use-cases/User/ReportedJobUseCase'

export class UserReportedJobController {

    constructor (
        private reportedJobUseCase: ReportedJobUseCase 
    ) {}

    reportJob: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {

            const email = (req as Request & { user?: string }).user;

            const { jobId, reportType, description } = req.body

            console.log(req.body)

            if (!email) {
                res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'User not authenticated', null));
                return;
            }

            if (!jobId || !reportType || !description) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Missing required fields', null));
                return;
            }

            const reportData = await this.reportedJobUseCase.createJob(email, jobId, reportType, description)

            res.status(HttpStatus.CREATED).json(createResponse('success', 'Job reported successfully', reportData));



        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to report job', error.message));

        }
    }

    
}