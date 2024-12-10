// /application/use-cases/checkAdminPassword.ts
import { AdminRepository } from '../../../domain/repositories/AdminRepository'
import { AuthService } from '../../../infrastructure/services/AuthService'

export class LoginAdminUseCase {

  constructor(
    private adminRepository: AdminRepository,
    private authService: AuthService
  ) { }

  async execute(email: string, password: string): Promise<{ success: boolean, message: string, accessToken?: string, refreshToken?: string }> {
    const admin = await this.adminRepository.findByEmail(email);

    if (!admin) {
      return { success: false, message: "Admin not found"};
    }
    
    const isPasswordValid = await this.authService.comparePassword(password, admin.password)

    if (isPasswordValid) {

      const accessToken = await this.authService.generateAccessToken({email: email, role: 'admin'})
      const refreshToken = await this.authService.generateRefreshToken({email: email, role: 'admin'})

      return { success: true, message: "Login successful", accessToken, refreshToken };
    } else {
      return { success: false, message: "Login error" };
    }

  }
}
