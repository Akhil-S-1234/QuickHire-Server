import { HttpStatus } from '../../../utils/HttpStatus'
import { createResponse } from '../../../utils/CustomResponse';
import { RequestHandler, Request, Response } from 'express';
// import { ScheduleInterviewUseCase } from '../../../application/use-cases/Recruiter/ScheduleInterviewUseCase'
import { ScheduleInterviewUseCase } from '../../../application/use-cases/Recruiter/ScheduleInterviewUseCase';

export class RecruiterInterviewController {
    constructor(
        private scheduleInterviewUseCase: ScheduleInterviewUseCase
    ) { }

    scheduleInterview: RequestHandler = async (req: Request, res: Response): Promise<void> => {

        const email = (req as Request & { user?: string }).user;

        if (!email) {
            res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'Recruiter not authenticated', null));
            return;
        }

        try {

            const { jobSeekerId, jobApplicationId, scheduledDate, scheduledTime } = req.body;

            console.log(req.body)

            const interview = await this.scheduleInterviewUseCase.scheduleInterview({
                jobSeekerId,
                jobApplicationId,
                scheduledDate,
                scheduledTime
            },
                email);

            res.status(HttpStatus.CREATED).json(createResponse('success', 'Interview Schedule', interview));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', error.message, null));
        }

    }

     
    getInterviewDetails: RequestHandler = async (req: Request, res: Response): Promise<void> => {

        const email = (req as Request & { user?: string }).user;

        if (!email) {
            res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'Recruiter not authenticated', null));
            return;
        }

        try {

        

            res.status(HttpStatus.CREATED).json(createResponse('success', 'Interview Schedule', null));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', error.message, null));
        }

    }
}