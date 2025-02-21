import { Request, Response, RequestHandler } from 'express';
import { HttpStatus } from '../../../utils/HttpStatus';
import { createResponse } from '../../../utils/CustomResponse';
import { SubscriptionPlanUseCase } from '../../../application/use-cases/Admin/SubscriptionPlanUseCase';
import { SubscriptionPlanDTO } from '@application/dtos/Admin/SubscriptionPlanDto';

export class AdminSubscriptionPlanController {
    constructor(
        private subscriptionPlanUseCase: SubscriptionPlanUseCase,
    ) { }

    createSubscriptionPlan: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {

            const subscriptionPlanData: SubscriptionPlanDTO = req.body

            if (!subscriptionPlanData) {
                res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'SubscriptionPlan not found', null));
            }

            const newSubscriptionPlan = await this.subscriptionPlanUseCase.create(subscriptionPlanData)

            res.status(HttpStatus.CREATED).json(createResponse('success', 'SubscriptionPlan created successfully', newSubscriptionPlan));
        } catch (error: any) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Internal server error', error.message));
        }
    }

    getAllSubscriptionPlans: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userType } = req.query;
            const subscriptionPlans = await this.subscriptionPlanUseCase.execute(userType as string);
            res.status(HttpStatus.OK).json(createResponse('success', 'Subscription Plans fetched successfully', subscriptionPlans));
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Server error', null));
        }
    };

    updateSubscriptionPlan: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { subscriptionPlanId } = req.params;

            const subscriptionPlanData: SubscriptionPlanDTO = req.body;

            const updatedSubscriptionPlan = await this.subscriptionPlanUseCase.update(subscriptionPlanId, subscriptionPlanData);

            if (updatedSubscriptionPlan) {
                res.status(HttpStatus.OK).json(createResponse('success', 'Subscription Plan price updated successfully', updatedSubscriptionPlan));
            } else {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'SubscriptionPlan not found', null));
            }
        } catch (error: any) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Server error', error.message));
        }
    };

    deleteSubscriptionPlan: RequestHandler = async (req: Request, res: Response): Promise<void> => {

        try {
            const { subscriptionPlanId } = req.params

            if (!subscriptionPlanId) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Subscription Plan ID is required', null));
                return;
            }
    
            const isDeleted = await this.subscriptionPlanUseCase.delete(subscriptionPlanId);

            if (isDeleted) {
                res.status(HttpStatus.OK).json(createResponse('success', 'Subscription Plan deleted successfully', null));
            } else {
                res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'Subscription Plan not found', null));
            }
        } catch (error: any) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Server error', error.message));
        }
    }
}
