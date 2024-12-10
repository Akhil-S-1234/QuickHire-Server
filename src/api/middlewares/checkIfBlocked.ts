
import { Request, Response, NextFunction } from 'express';
import { CheckIfBlockedUseCase } from '../../application/use-cases/User/CheckIfBlockedUseCase'; // Import UserService
import { HttpStatus } from '../../utils/HttpStatus'; // Import your HttpStatus enum
import { createResponse } from '../../utils/CustomResponse'; // Your custom response function
import { UserRepository } from '../../domain/repositories/UserRepository'

interface customRequest extends Request {
  user?: any; // User info added after authentication middleware
}
export class CheckIfBlockedMiddleware {

  // Inject UserService via constructor
  constructor(private checkIfBlockedUseCase : CheckIfBlockedUseCase) { 
    console.log('CheckIfBlockedUseCase initialized:', checkIfBlockedUseCase);  // Debugging line

   }

 checkIfBlocked = async (
    req: customRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const email = req.user; // Assuming the user's email is set after authentication

      if (!email) {
         res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'User email is missing', null));
         return
      }

      const isBlocked = await this.checkIfBlockedUseCase.checkIfBlocked(email);

      if (isBlocked) {
         res.status(HttpStatus.FORBIDDEN).json(createResponse('error', 'Your account is blocked', null));
         return
      }

      // Continue to the next middleware if the user is not blocked
      next();
    } catch (error: any) {
      console.error('Error in checkIfBlocked middleware:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Internal server error', null));
    }
  }
}
