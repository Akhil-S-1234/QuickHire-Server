import { HttpStatus} from '../../../utils/HttpStatus'
import { createResponse } from '../../../utils/CustomResponse';
import { RequestHandler, Request, Response  } from 'express';
import { RecruiterJobUseCase } from '../../../application/use-cases/Recruiter/RecruiterJobUseCase';

export class RecruiterJobController {
    constructor(
private recruiterJobUseCase: RecruiterJobUseCase
    ) { }

    postJob : RequestHandler = async ( req: Request, res: Response ): Promise<void> => {

        const { job } = req.body

        if(!job){
            res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'Job details not found', null))
        }

        const requestedJob = await this.recruiterJobUseCase.execute(job)

        
    }
}