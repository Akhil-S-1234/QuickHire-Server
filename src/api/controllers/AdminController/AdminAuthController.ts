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

                res.cookie('adminAccessToken', result.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                    sameSite: 'strict',
                    maxAge: 15 * 60 * 1000, // Token expires in 15 min
                    // maxAge: 1 * 60 * 1000, // Token expires in 15 min
                });

                res.cookie('adminRefreshToken', result.refreshToken, {
                    httpOnly: true,  // Can't be accessed by JavaScript
                    secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production (HTTPS)
                    sameSite: 'strict',  // Prevents the cookie from being sent in cross-site requests
                    maxAge: 7 * 24 * 60 * 60 * 1000,  // Expiration time (e.g., 7 days)
                    // maxAge: 6 * 60 * 1000, // Token expires in 15 min,
                });

                res.status(HttpStatus.OK).json(createResponse('success', 'Login successful', {email: email}));
            } else {

                res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', result.message, null));
            }
        } catch (error: any) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Server error', null));
        }
    };

    logout: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {

            console.log('Admin Logout')
            // Clear the access and refresh token cookies by setting them to expire
            res.clearCookie('adminAccessToken', { httpOnly: true, secure: true, sameSite: 'strict' });
            res.clearCookie('adminRefreshToken', { httpOnly: true, secure: true, sameSite: 'strict' });

            // Respond with a success message
            res.status(HttpStatus.OK).json(createResponse('success', 'Logged out successfully', null));
        } catch (error) {
            // Handle any potential errors
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Error logging out', null));
        }
    }

}
