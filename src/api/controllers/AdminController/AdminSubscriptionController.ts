import { Request, Response, RequestHandler } from 'express';
import { HttpStatus } from '../../../utils/HttpStatus';
import { createResponse } from '../../../utils/CustomResponse';
import { SubscriptionUseCase } from '../../../application/use-cases/Admin/SubscriptionUseCase';

export class AdminSubscriptionController {
    constructor(
        private subscriptionUseCase: SubscriptionUseCase,
    ) { }

    getAllSubscriptions: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userType } = req.query;
            const subscriptions = await this.subscriptionUseCase.execute(userType as string);
            res.status(HttpStatus.OK).json(createResponse('success', 'Subscriptions fetched successfully', subscriptions));
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Server error', null));
        }
    };

    updateSubscriptionPrice: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { subscriptionId } = req.params;
            const { price } = req.body;

            console.log(subscriptionId, price)

            const updatedSubscription = await this.subscriptionUseCase.update(subscriptionId, price);

            if (updatedSubscription) {
                res.status(HttpStatus.OK).json(createResponse('success', 'Subscription price updated successfully', updatedSubscription));
            } else {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Subscription not found', null));
            }
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Server error', null));
        }
    };
}
