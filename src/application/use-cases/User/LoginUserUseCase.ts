import { User } from '../../../domain/entities/User'
import { UserRepository } from '../../../domain/repositories/UserRepository'
import { AuthService } from '../../../infrastructure/services/AuthService'

export class LoginUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private authService: AuthService
    ) {}

    async executeLogin(email: string, password: string): Promise<{accessToken: string, refreshToken: string, user: Partial<User>}> {

        const user = await this.userRepository.findByEmail(email)
        if (!user) {
            throw new Error('User not found')
        }

        if(user.isBlocked){
            throw new Error('User is restricted')
        }

        const isPasswordValid = await this.authService.comparePassword(password, user.password ?? '');
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const accessToken = await this.authService.generateAccessToken({email: user.email})
        const refreshToken = await this.authService.generateRefreshToken({email: user.email})

        const { password: _, ...userData } = user


        return {accessToken, refreshToken , user: userData};

    }

    async executeCallback( email: string, firstName: string, lastName: string, profilePicture: string): Promise<{ accessToken: string, refreshToken: string}> {

        const user = await this.userRepository.findByEmail(email)

        if (!user) {

            const newUser = new User(
                '',
                firstName,
                lastName,
                email,
                '',
                '',
                profilePicture
            )

            await this.userRepository.save(newUser)

        }

        if(user && user.isBlocked){
            throw new Error('User is restricted')
        }

        const accessToken = await this.authService.generateAccessToken({email: email})
        const refreshToken = await this.authService.generateRefreshToken({email: email})


        return {accessToken, refreshToken};
    }

    async refreshTokens(refreshToken: string): Promise<{ accessToken: string }> {
        try {

            const decoded = await this.authService.verifyRefreshToken(refreshToken);
            
            if (!decoded) {
                throw new Error('Invalid or expired refresh token');
            }

            console.log(decoded)

            // const user = await this.userRepository.findByEmail(decoded.email);
            // if (!user) {
            //     throw new Error('User not found');
            // }

            // console.log(user,'user')

            const newAccessToken = await this.authService.generateAccessToken({ email: decoded.email });

            return { accessToken: newAccessToken};
        } catch (error : any) {
            throw new Error('Failed to refresh tokens: ' + error.message);
        }
    }


}