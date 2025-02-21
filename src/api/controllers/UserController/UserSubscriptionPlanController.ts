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

  createPayment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const payment = await this.subscriptionPlanUseCase.createPayment(req.body);
      res.status(HttpStatus.OK).json(createResponse('success', 'Payment created successfully', payment));
    } catch (error: any) {
      console.error('Error creating payment:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to create payment', error.message));
    }
  };

  verifyPayment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const email = (req as Request & { user?: string }).user;  // Assume email is in req.user

      if (!email) {
        res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'Invalid Email', null))
        return
      }
      const { type } = req.body;
      const isVerified = await this.subscriptionPlanUseCase.verifyPayment(type, email);

      if (isVerified) {
        res.status(HttpStatus.OK).json(createResponse('success', 'Payment verified successfully', null));
      } else {
        res.status(HttpStatus.BAD_REQUEST).json(createResponse('fail', 'Payment verification failed', null));
      }
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to verify payment', error.message));
    }
  };

  getSubscriptionStatus: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const email = (req as Request & { user?: string }).user; // Assume the user's email is available in req.user

      if (!email) {
        res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'Invalid Email', null));
        return;
      }

      const subscriptionStatus = await this.subscriptionPlanUseCase.getSubscriptionDetails(email);

      if (subscriptionStatus) {
        res.status(HttpStatus.OK).json(createResponse('success', 'Subscription status retrieved successfully', subscriptionStatus));
      } else {
        res.status(HttpStatus.NOT_FOUND).json(createResponse('fail', 'No active subscription found', null));
      }
    } catch (error: any) {
      console.error('Error fetching subscription status:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to retrieve subscription status', error.message));
    }
  };

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
