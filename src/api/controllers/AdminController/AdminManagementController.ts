import { Request, Response, RequestHandler } from 'express';
import { HttpStatus } from '../../../utils/HttpStatus';
import { createResponse } from '../../../utils/CustomResponse';
import { GetAllUsersUseCase } from '../../../application/use-cases/Admin/GetAllUsersUseCase';
import { ToggleBlockUseCase } from '../../../application/use-cases/Admin/ToggleBlockUseCase';

export class AdminManageController {
    constructor(
        private getAllUsersUseCase: GetAllUsersUseCase,          // Use case for fetching users
        private toggleBlockUseCase: ToggleBlockUseCase    // Use case for blocking/unblocking users
    ) {}

    // Method to get all users
    getAllUsers: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.getAllUsersUseCase.execute();

            res.status(HttpStatus.OK).json(createResponse('success', 'Users fetched successfully', users));
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Server error', null));
        }
    };

    getAllRecruiters: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.getAllUsersUseCase.getRecruiters();

            res.status(HttpStatus.OK).json(createResponse('success', 'Users fetched successfully', users));
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Server error', null));
        }
    };

    toggleBlockUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const { isBlocked } = req.body;

            const result = await this.toggleBlockUseCase.toggleBlockUser(userId, isBlocked);

            if (result) {
                res.status(HttpStatus.OK).json(createResponse('success', `User is ${isBlocked ? 'blocked' : 'unblocked'} sucessfully`, null));
            } else {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Error while updating', null));
            }
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Server error', null));
        }
    };

    toggleBlockRecruiter: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { recruiterId } = req.params;
            const { isBlocked } = req.body;

            const result = await this.toggleBlockUseCase.toggleBlockRecruiter(recruiterId, isBlocked);

            if (result) {
                res.status(HttpStatus.OK).json(createResponse('success', `Recruiter is ${isBlocked ? 'blocked' : 'unblocked'} sucessfully`, null));
            } else {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Error while updating', null));
            }
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Server error', null));
        }
    };
}
