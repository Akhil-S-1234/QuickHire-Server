import { OtpRepository } from '../../domain/repositories/OtpRepository';
import { Otp } from '../../domain/entities/Otp';
import OtpModel from '../database/models/OtpModel'; // Create this model similarly to UserModel

export class MongoOtpRepository implements OtpRepository {
    
    async createOtp(otp: Otp): Promise<void> {
        const otpRecord = new OtpModel(otp);
        await otpRecord.save();
    }

    async findOtpByEmail(email: string): Promise<Otp | null> {
        const otp = await OtpModel.findOne({ email });
        return otp ? new Otp(otp.email, otp.otp, otp.createdAt) : null;
    }

    async deleteOtpByEmail(email: string): Promise<void> {
        await OtpModel.deleteOne({ email })
    }
}
