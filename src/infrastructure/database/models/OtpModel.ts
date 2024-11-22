import mongoose, { Schema, Document } from 'mongoose';

interface OtpDocument extends Document {
    email: string;
    otp: string;
    createdAt: Date;
}

const OtpSchema: Schema = new Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '5m' }, // OTP expires in 5 minutes
});

const OtpModel = mongoose.model<OtpDocument>('Otp', OtpSchema);
export default OtpModel;
