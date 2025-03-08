import { RequestHandler, Request, Response } from 'express';
import { HttpStatus } from '../../../utils/HttpStatus'
import { createResponse } from '../../../utils/CustomResponse';
import { SubscriptionUseCase } from '../../../application/use-cases/User/SubscriptionUseCase';

export class UserSubscriptionController {

  constructor(
    private subscriptionUseCase: SubscriptionUseCase
  ) { }

  createPayment: RequestHandler = async (req: Request, res: Response): Promise<void> => {

    try {
      const { planId, interval, amount, totalCount, autoRenewal } = req.body;

      const email = (req as Request & { user?: string }).user;  // Assume email is in req.user

      if (!email) {
        res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'Invalid Email', null))
        return
      }

      const subscription = await this.subscriptionUseCase.createSubscription({
        email,
        planId,
        interval,
        amount,
        totalCount,
        autoRenewal
      });

      res.status(HttpStatus.OK).json(createResponse('success', 'Subscription created successfully', subscription));

    } catch (error: any) {
      console.error(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to create payment', error.message));
    }
  }

  activateSubscription: RequestHandler = async (req: Request, res: Response): Promise<void> => {

    try {
      const { subscriptionId, razorpayPaymentId, razorpaySubscriptionId, razorpaySignature, autoRenewal, planDetails } = req.body;

      const email = (req as Request & { user?: string }).user;  // Assume email is in req.user

      if (!email) {
        res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'Invalid Email', null))
        return
      }

      const subscription = await this.subscriptionUseCase.activateSubscription({
        email, subscriptionId, razorpayPaymentId, razorpaySubscriptionId, razorpaySignature, autoRenewal, planDetails
      });

      res.status(HttpStatus.OK).json(createResponse('success', 'Subscription Activated successfully', subscription));

    } catch (error: any) {
      console.error(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to create payment', error.message));
    }
  }


  getSubscriptionStatus: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const email = (req as Request & { user?: string }).user; // Assume the user's email is available in req.user

      if (!email) {
        res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'Invalid Email', null));
        return;
      }

      const subscriptionDetails = await this.subscriptionUseCase.getSubscriptionDetails(email);

      if (subscriptionDetails) {
        res.status(HttpStatus.OK).json(createResponse('success', 'Subscription status retrieved successfully', subscriptionDetails));
      } else {
        res.status(HttpStatus.OK).json(createResponse('success', 'No active subscription found', null));
      }
    } catch (error: any) {
      console.error('Error fetching subscription status:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to retrieve subscription status', error.message));
    }
  };

  activateOrder: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature, planDetails } = req.body;
  
      const email = (req as Request & { user?: string }).user;
  
      if (!email) {
        res.status(HttpStatus.NOT_FOUND).json(createResponse('error', 'Invalid Email', null));
        return;
      }
  
      const order = await this.subscriptionUseCase.activateOrder({
        email,
        orderId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        planDetails
      });
  
      res.status(HttpStatus.OK).json(createResponse('success', 'Order activated successfully', order));
  
    } catch (error: any) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to activate order', error.message));
    }
  }

  handleWebhook: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      // Verify webhook signature
      const webhookSignature = req.headers['x-razorpay-signature'] as string;
      
      if (!webhookSignature) {
        res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Missing webhook signature', null));
        return;
      }

      await this.subscriptionUseCase.handleWebhook(webhookSignature, req.body)

      // Respond with success
      res.status(HttpStatus.OK).json(createResponse('success', 'Webhook processed successfully', null));
    } catch (error: any) {
      console.error('Error processing webhook:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Failed to process webhook', error.message));
    }
  };


}