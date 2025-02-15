import { RequestHandler, Request, Response } from 'express';
import { SubscriptionUseCase } from '../../../application/use-cases/User/SubscriptionUseCase';
import { HttpStatus } from '../../../utils/HttpStatus'
import { createResponse } from '../../../utils/CustomResponse';

export class UserSubscriptionController  {
  constructor(private subscriptionUseCase: SubscriptionUseCase) { }

  createPayment: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const payment = await this.subscriptionUseCase.createPayment(req.body);
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
      const isVerified = await this.subscriptionUseCase.verifyPayment(type, email);

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

  // In UserSubscriptionController
getSubscriptionStatus: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = (req as Request & { user?: string }).user; // Assume the user's email is available in req.user

    if (!email) {
      res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'Invalid Email', null));
      return;
    }

    const subscriptionStatus = await this.subscriptionUseCase.getSubscriptionDetails(email);

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




}
