import { Recruiter } from '../../../domain/entities/Recruiter';
import { RecruiterRepository } from '../../../domain/repositories/RecruiterRepository';
import { AuthService } from '../../../infrastructure/services/AuthService';

export class LoginRecruiterUseCase {
    constructor(
        private recruiterRepository: RecruiterRepository,
        private authService: AuthService
    ) {}

    async executeLogin(email: string, password: string): Promise<{accessToken: string, refreshToken: string, recruiter: Partial<Recruiter>}> {

        const recruiter = await this.recruiterRepository.findByEmail(email);
        if (!recruiter) {
            throw new Error('Recruiter not found');
        }

        if(recruiter.accountStatus == 'pending'){
            throw new Error('Recruiter review is pending');
        }

        if(recruiter.accountStatus == 'suspended'){
            throw new Error('Recruiter is suspended');
        }

        if(recruiter.isBlocked) {
            throw new Error('Recruiter is blocked')
        }

        

        console.log(recruiter)

        const isPasswordValid = await this.authService.comparePassword(password, recruiter.password ?? '');
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const accessToken = await this.authService.generateAccessToken({ email: recruiter.email });
        const refreshToken = await this.authService.generateRefreshToken({ email: recruiter.email });

        const { password: _, ...recruiterData } = recruiter;

        return { accessToken, refreshToken, recruiter: recruiterData };
    }

    async refreshTokens(refreshToken: string): Promise<{ accessToken: string }> {
        try {
            const decoded = await this.authService.verifyRefreshToken(refreshToken);

            if (!decoded) {
                throw new Error('Invalid or expired refresh token');
            }

            const recruiter = await this.recruiterRepository.findByEmail(decoded.email);
            if (!recruiter) {
                throw new Error('Recruiter not found');
            }

            const newAccessToken = await this.authService.generateAccessToken({ email: recruiter.email });

            return { accessToken: newAccessToken };
        } catch (error: any) {
            throw new Error('Failed to refresh tokens: ' + error.message);
        }
    }
}
