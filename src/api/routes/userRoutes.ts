import express from 'express';

import { UserAuthController } from '../controllers/UserController/UserAuthController'
import { UserProfileController } from '../controllers/UserController/UserProfileController';

import { MongoUserRepository } from '../../infrastructure/respositories/MongoUserRepository';
import { MongoOtpRepository } from '../../infrastructure/respositories/MongoOtpRepository'

import { RegisterUserUseCase } from '../../application/use-cases/User/RegisterUserUseCase';
import { VerifyOtpUseCase } from '../../application/use-cases/User/VerifyOtpUseCase'
import { LoginUserUseCase } from '../../application/use-cases/User/LoginUserUseCase';
import { UserProfileUseCase } from '../../application/use-cases/User/UserProfileUseCase'; 
import { CheckIfBlockedUseCase } from '../../application/use-cases/User/CheckIfBlockedUseCase'; 


import { EmailService } from '../../infrastructure/services/EmailService';
import { AuthService } from '../../infrastructure/services/AuthService'

import { verifyAccessToken } from '../middlewares/VerifyToken'
import uploadToS3, { upload } from '../middlewares/uploadToS3'; // Import multer and uploadToS3
import { CheckIfBlockedMiddleware } from '../middlewares/checkIfBlocked'; // Import CheckIfBlockedMiddleware


const router = express.Router()

// Repository instances
const userRepository = new MongoUserRepository()
const otpRepository = new MongoOtpRepository()

// Service instances
const emailService = new EmailService()
const authService = new AuthService()

// Use cases with dependency injection
const registerUserUseCase = new RegisterUserUseCase(userRepository, otpRepository, emailService)
const verifyOtpUseCase = new VerifyOtpUseCase(otpRepository, userRepository)
const loginUserUseCase = new LoginUserUseCase(userRepository, authService)
const userProfileUseCase = new UserProfileUseCase(userRepository); 
const checkIfBlockedUseCase = new CheckIfBlockedUseCase(userRepository)

// Controller with injected use cases and services
const userAuthController = new UserAuthController(registerUserUseCase, verifyOtpUseCase, loginUserUseCase, authService)
const userProfileController = new UserProfileController(userProfileUseCase);  

const checkIfBlockedMiddleware = new CheckIfBlockedMiddleware(checkIfBlockedUseCase)


// Authentication routes
router.post('/callback', userAuthController.handleCallback)
router.post('/register', userAuthController.register)
router.post('/verify-otp', userAuthController.verifyOtp)
router.get('/resend-otp', userAuthController.resendOtp)
router.post('/login', userAuthController.login)
router.post('/logout', verifyAccessToken, userAuthController.logout)
router.get('/refreshtoken', userAuthController.refreshToken)

// User profile routes
router.get('/profile', verifyAccessToken, checkIfBlockedMiddleware.checkIfBlocked, userProfileController.getProfile);
router.put('/profile', verifyAccessToken, userProfileController.updateProfile)
router.post('/profile/skills', verifyAccessToken, userProfileController.addSkill)
router.delete('/profile/skills/:skill', verifyAccessToken, userProfileController.removeSkill)
router.post('/profile/photo', verifyAccessToken, upload.single('photo'), uploadToS3 , userProfileController.addProfilePicture)
router.post('/profile/resume', verifyAccessToken, upload.single('resume'), uploadToS3 , userProfileController.addresume)
router.post('/profile/education', verifyAccessToken, userProfileController.addEducation)
router.delete('/profile/education/:educationId', verifyAccessToken, userProfileController.removeEducation)
router.post('/profile/experience', verifyAccessToken, userProfileController.addExperience)
router.delete('/profile/experience/:experienceId', verifyAccessToken, userProfileController.removeExperience)

export default router