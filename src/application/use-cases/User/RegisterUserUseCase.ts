import { UserRepository } from "@domain/repositories/UserRepository";
import { User } from "../../../domain/entities/User";
import { Otp } from '../../../domain/entities/Otp'
import { RegisterUserDto } from "../../dtos/User/RegisterUserDto";
import { OtpRepository } from '../../../domain/repositories/OtpRepository'
import { EmailService } from "../../../infrastructure/services/EmailService";

export class RegisterUserUseCase {

  constructor(
    private userRepository: UserRepository,
    private otpRepository: OtpRepository,
    private emailService: EmailService
  ) {}

  async execute(userEmail: string): Promise<void> {

    const existingUser = await this.userRepository.findByEmail(userEmail)
    if(existingUser) throw new Error('Email already in use')

    await this.otpRepository.deleteOtpByEmail(userEmail)

    const otp = this.generateOtp()
    console.log('Generated Otp',otp)
    const otpEntity = new Otp(userEmail, otp)

    await this.otpRepository.createOtp(otpEntity)
    await this.emailService.sendOtpEmail(userEmail, otp)

  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  
  
}