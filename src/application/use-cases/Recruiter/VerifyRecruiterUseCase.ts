import { OtpRepository } from "../../../domain/repositories/OtpRepository";
import { RecruiterRepository } from "../../../domain/repositories/RecruiterRepository";
import { Recruiter } from '../../../domain/entities/Recruiter';

export class VerifyOtpRecruiterUseCase {
    constructor(
        private otpRepository: OtpRepository,
        private recruiterRepository: RecruiterRepository
    ) {}

    async verify(otp: string, sessionRecruiterData: any): Promise<void> {
        
        const existingOtp = await this.otpRepository.findOtpByEmail(sessionRecruiterData.email);
        if (!existingOtp || existingOtp.otp !== otp) {
            throw new Error('Invalid or expired OTP');
        }

        const newRecruiter = new Recruiter(
            '', 
            sessionRecruiterData.name,
            sessionRecruiterData.email,
            sessionRecruiterData.phone,
            sessionRecruiterData.position,
            sessionRecruiterData.companyName,
            sessionRecruiterData.password
        );

        await this.recruiterRepository.save(newRecruiter);

        console.log('Recruiter Registered');
    }
}
