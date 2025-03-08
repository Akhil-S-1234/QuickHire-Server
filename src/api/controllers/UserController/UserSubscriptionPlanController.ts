import { RequestHandler, Request, Response } from 'express';
import { SubscriptionPlanUseCase } from '../../../application/use-cases/User/SubscriptionPlanUseCase';
import { HttpStatus } from '../../../utils/HttpStatus'
import { createResponse } from '../../../utils/CustomResponse';

export class UserSubscriptionPlanController {

  constructor(
    private subscriptionPlanUseCase: SubscriptionPlanUseCase
  ) { }

  getSubscriptionPlans: RequestHandler = async (req: Request, res: Response): Promise<void> => {

    try {
      const userType = 'job_seeker';

      const subscriptionPlans = await this.subscriptionPlanUseCase.getSubscriptionPlans(userType);

      res.status(HttpStatus.OK).json(createResponse('success', 'Subscription plans retrieved successfully', subscriptionPlans));
    } catch (error: any) {
      console.error('Error fetching subscription plans:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to retrieve subscription plans', error.message));
    }
  }

  getSubscriptionPlanById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { subscriptionPlanId } = req.params;

      if (!subscriptionPlanId) {
        res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Subscription Plan ID is required', null));
        return;
      }

      const subscriptionPlan = await this.subscriptionPlanUseCase.getSubscriptionPlanById(subscriptionPlanId);

      if (!subscriptionPlan) {
        res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'Subscription Plan not found', null));
        return;
      }

      res.status(HttpStatus.OK).json(createResponse('success', 'Subscription Plan retrieved successfully', subscriptionPlan));
    } catch (error: any) {
      console.error('Error fetching subscription by ID:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to retrieve subscription Plan', error.message));
    }
  };

}
