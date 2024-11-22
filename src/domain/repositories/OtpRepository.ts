import { Otp } from '../entities/Otp'

export interface OtpRepository {
    createOtp(otp : Otp): Promise<void>
    findOtpByEmail(email: string): Promise<Otp | null>
    deleteOtpByEmail(email: string): Promise<void>
}