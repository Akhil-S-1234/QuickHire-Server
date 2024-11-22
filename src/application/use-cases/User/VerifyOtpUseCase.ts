import { OtpRepository } from "../../../domain/repositories/OtpRepository";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { User } from '../../../domain/entities/User'

export class VerifyOtpUseCase {
    constructor(
        private otpRepository: OtpRepository,
        private userRepository: UserRepository
    ) {}

    async verify(otp: string, sessionUserData: any): Promise<void> {
        
        const existingOtp = await this.otpRepository.findOtpByEmail(sessionUserData.email)
        if(!existingOtp || existingOtp.otp !== otp) {
            throw new Error('Invalid or expired OTP')
        }

        const newUser = new User(
            '', 
            sessionUserData.firstName,
            sessionUserData.lastName,
            sessionUserData.email,
            sessionUserData.phoneNumber,
            sessionUserData.password
        );

        await this.userRepository.save(newUser)

        console.log('User Registered')
    }
}