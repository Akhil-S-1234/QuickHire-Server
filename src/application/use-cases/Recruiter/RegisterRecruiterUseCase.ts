import { RecruiterRepository } from "@domain/repositories/RecruiterRepository";
import { Recruiter } from "../../../domain/entities/Recruiter";
import { Otp } from "../../../domain/entities/Otp";
import { RecruiterDTO } from "../../dtos/Recruiter/RecruiterProfileDto";
import { OtpRepository } from "../../../domain/repositories/OtpRepository";
import { EmailService } from "../../../infrastructure/services/EmailService";

export class RegisterRecruiterUseCase {
  constructor(
    private recruiterRepository: RecruiterRepository,
    private otpRepository: OtpRepository,
    private emailService: EmailService
  ) {}

  async execute(recruiterEmail: string): Promise<void> {
    const existingRecruiter = await this.recruiterRepository.findByEmail(recruiterEmail);
    if (existingRecruiter) throw new Error("Email already in use");

    // Delete any existing OTP for this email to avoid conflicts
    await this.otpRepository.deleteOtpByEmail(recruiterEmail);

    // Generate and save a new OTP for email verification
    const otp = this.generateOtp();
    console.log("Generated OTP:", otp);
    const otpEntity = new Otp(recruiterEmail, otp);

    await this.otpRepository.createOtp(otpEntity);
    await this.emailService.sendOtpEmail(recruiterEmail, otp);

    // Additional recruiter-specific logic can go here
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
