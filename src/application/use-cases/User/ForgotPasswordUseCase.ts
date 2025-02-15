import { User } from '../../../domain/entities/User'
import { UserRepository } from '../../../domain/repositories/UserRepository'
import { AuthService } from '../../../infrastructure/services/AuthService'
import { EmailService } from "../../../infrastructure/services/EmailService";

export class ForgotPasswordUseCase {
    constructor(
        private userRepository: UserRepository,
        private authService: AuthService,
        private emailService: EmailService
    ) {}

    // Method to send a reset link to the user's email
    async sendResetLink(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const token = await this.authService.generateAccessToken({email : user.email}); // Generate a secure token

        console.log(token)
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        await this.emailService.sendResetEmail( user.email, resetLink)  

        // Optionally store the token in the database if needed for validation later
        // await this.userRepository.saveResetToken(user.id, token);
    }

    // Method to reset the user's password
    async resetPassword(token: string, newPassword: string): Promise<void> {
        const decoded = await this.authService.verifyAccessToken(token); // Validate and extract user ID
        if (!decoded) {
            throw new Error('Invalid or expired token');
        }

        const hashedPassword = await this.authService.hashPassword(newPassword); // Hash the password securely
        await this.userRepository.updateUserProfile(decoded.email, {password: newPassword});

        // Optionally clear the reset token to prevent reuse
        // await this.userRepository.clearResetToken(userId);
    }
}