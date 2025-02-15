import { RequestHandler, Request, Response } from 'express';
import { RegisterRecruiterUseCase } from '../../../application/use-cases/Recruiter/RegisterRecruiterUseCase';
import { VerifyOtpRecruiterUseCase } from '../../../application/use-cases/Recruiter/VerifyRecruiterUseCase';
import { LoginRecruiterUseCase } from '../../../application/use-cases/Recruiter/LoginRecruiterUseCase';
import { RecruiterDTO } from '../../../application/dtos/Recruiter/RecruiterProfileDto';
import { HttpStatus } from '../../../utils/HttpStatus';
import { createResponse } from '../../../utils/CustomResponse';
import { AuthService } from '../../../infrastructure/services/AuthService';

export class RecruiterAuthController {
    constructor(
        private registerRecruiterUseCase: RegisterRecruiterUseCase,
        private verifyOtpUseCase: VerifyOtpRecruiterUseCase,
        private loginRecruiterUseCase: LoginRecruiterUseCase,
        private authService: AuthService
    ) { }

    register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {

            console.log(req.body)

            const image = (req as Request & { Url?: string }).Url

            console.log(image)


            const recruiterData: RecruiterDTO = req.body;

            const hashedPassword = await this.authService.hashPassword(recruiterData.password);
            recruiterData.password = hashedPassword;
            recruiterData.profilePicture = image ? image : '';

            await this.registerRecruiterUseCase.execute(recruiterData.email);

            req.session.recruiter = recruiterData;

            res.status(HttpStatus.CREATED).json(createResponse('success', 'Verification email sent', null));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', error.message, null));
        }
    };

    verifyOtp: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { otp } = req.body;

            if (!req.session.recruiter) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'No registration data found', null));
                return;
            }

            console.log(req.session.recruiter)

            await this.verifyOtpUseCase.verify(otp, req.session.recruiter);
            req.session.recruiter = undefined;

            res.status(HttpStatus.CREATED).json(createResponse('success', 'Recruiter registered successfully', null));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', error.message, null));
        }
    };

    resendOtp: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.session.recruiter) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'No registration data found', null));
                return;
            }

            await this.registerRecruiterUseCase.execute(req.session.recruiter.email);
            res.status(HttpStatus.CREATED).json(createResponse('success', 'Verification email resent', null));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', error.message, null));
        }
    };

    login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            console.log(req.body)

            if (!email || !password) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Email and password are required', null));
                return;
            }


            const { accessToken, refreshToken, recruiter } = await this.loginRecruiterUseCase.executeLogin(email, password);

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000,
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(HttpStatus.OK).json(createResponse('success', 'Login successful', { recruiter }));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', error.message, null));
        }
    };

    logout: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'strict' });
            res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' });

            res.status(HttpStatus.OK).json(createResponse('success', 'Logged out successfully', null));
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Error logging out', null));
        }
    };


    refreshToken: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                res.status(HttpStatus.BAD_REQUEST).json(createResponse('error', 'Refresh token missing', null));
                return;
            }

            const { accessToken } = await this.loginRecruiterUseCase.refreshTokens(refreshToken);

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000,
            });

            res.status(HttpStatus.OK).json(createResponse('success', 'Access token refreshed', null));
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(createResponse('error', 'Error refreshing token', null));
        }
    };
}
