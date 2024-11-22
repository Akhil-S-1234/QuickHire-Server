import { Request, Response, RequestHandler } from 'express';
import { HttpStatus } from '../../../utils/HttpStatus';  // Ensure this is set up with HTTP status codes
import { createResponse } from '../../../utils/CustomResponse';  // A helper for consistent response format
import { AuthService } from '../../../infrastructure/services/AuthService';  // AuthService for hashing passwords and generating tokens
import { LoginAdminUseCase } from '../../../application/use-cases/Admin/LoginAdminUseCase';  // Use case to check the admin credentials

export class AdminAuthController {
    constructor(
        private loginAdminUseCase: LoginAdminUseCase, 
        private authService: AuthService 
    ) { }

    // Login method for admin authentication
    login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Email and password are required', null));
                return
            }

            // Use the CheckAdminPassword use case to validate the admin's credentials
            const result = await this.loginAdminUseCase.execute(email, password);

            console.log(result)

            if (result.success) {                
                // Send response with the token and success message
                res.status(HttpStatus.OK).json(createResponse('success', 'Login successful', null));
            } else {

                res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', result.message, null));
            }
        } catch (error: any) {
            console.error(error); 
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Server error', null));
        }
    };

}
