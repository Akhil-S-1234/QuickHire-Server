import { RequestHandler, Request, Response } from 'express';
import { RegisterUserUseCase } from '../../../application/use-cases/User/RegisterUserUseCase';
import { VerifyOtpUseCase } from '../../../application/use-cases/User/VerifyOtpUseCase';
import { LoginUserUseCase } from '../../../application/use-cases/User/LoginUserUseCase';
import { RegisterUserDto } from '../../../application/dtos/User/RegisterUserDto';
import { HttpStatus } from '../../../utils/HttpStatus';
import { createResponse } from '../../../utils/CustomResponse';
import { AuthService } from '../../../infrastructure/services/AuthService';
import { log } from 'console';

export class UserAuthController {
    constructor(
        private registerUserUseCase: RegisterUserUseCase,
        private verifyOtpUseCase: VerifyOtpUseCase,
        private loginUserUseCase: LoginUserUseCase,
        private authService: AuthService
    ) { }

    register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const userData: RegisterUserDto = req.body;

            const hashedPassword = await this.authService.hashPassword(userData.password);
            userData.password = hashedPassword;

            await this.registerUserUseCase.execute(userData.email);

            req.session.user = userData;

            console.log(req.session.user)

            res.status(HttpStatus.CREATED).json(createResponse('success', 'Verification email sent', null));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', error.message, null));
        }
    };

    verifyOtp: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { otp } = req.body;

            console.log(otp,'1212')

            console.log(req.session.user)

            if (!req.session.user) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'No registration data found', null));
                return; // Ensure to return here to stop further execution
            }

            console.log('2')

            await this.verifyOtpUseCase.verify(otp, req.session.user);
            req.session.user = undefined;

            res.status(HttpStatus.CREATED).json(createResponse('success', 'User registered successfully', null));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', error.message, null));
        }
    };

    resendOtp: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.session.user) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'No registration data found', null));
                return;
            }

            await this.registerUserUseCase.execute(req.session.user.email);
            res.status(HttpStatus.CREATED).json(createResponse('success', 'Verification email resent', null));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', error.message, null));
        }
    };

    login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Email and password are required', null));
                return;
            }

            const { accessToken, refreshToken, user } = await this.loginUserUseCase.executeLogin(email, password);

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000, // Token expires in 15 min
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,  // Can't be accessed by JavaScript
                secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production (HTTPS)
                sameSite: 'strict',  // Prevents the cookie from being sent in cross-site requests
                maxAge: 7 * 24 * 60 * 60 * 1000,  // Expiration time (e.g., 7 days)
            });

            res.status(HttpStatus.OK).json(createResponse('success', 'Login successful', { user }));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', error.message, null));
        }
    };

    logout: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {

            console.log('geg')
            // Clear the access and refresh token cookies by setting them to expire
            res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'strict' });
            res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' });

            // Respond with a success message
            res.status(HttpStatus.OK).json(createResponse('success', 'Logged out successfully', null));
        } catch (error) {
            // Handle any potential errors
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Error logging out', null));
        }
    }

    handleCallback: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, name, image } = req.body;

            if (!email || !name) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Email and name are required', null));
                return;
            }

            const [firstName, lastName = ''] = name.split(' ');

            // Call the callback handler to check if the user exists, or create a new user
            const { accessToken, refreshToken } = await this.loginUserUseCase.executeCallback(email, firstName, lastName, image);

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000, // Token expires in 15 min
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,  // Can't be accessed by JavaScript
                secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production (HTTPS)
                sameSite: 'strict',  // Prevents the cookie from being sent in cross-site requests
                maxAge: 7 * 24 * 60 * 60 * 1000,  // Expiration time (e.g., 7 days)
            });

            res.status(HttpStatus.OK).json(createResponse('success', 'Login successful', null));

        } catch (error: any) {
            // Improved error handling
            console.error('Error handling callback:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'An error occurred during login', null));
        }
    }


    refreshToken: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Refresh token missing', null));
                return;
            }

            console.log('we')

            // Issue a new access token
            const { accessToken } = await this.loginUserUseCase.refreshTokens(refreshToken);

            console.log('23')
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000, // Token expires in 15 min
            });

            res.status(HttpStatus.OK).json(createResponse('success', 'Access token refreshed', null));
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Error refreshing token', null));
        }
    }

}

