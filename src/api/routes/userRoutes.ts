import express from 'express';

import { UserAuthController } from '../controllers/UserController/UserAuthController'
import { UserProfileController } from '../controllers/UserController/UserProfileController';
import { UserJobController } from '../controllers/UserController/UserJobController';
import { UserSubscriptionPlanController  } from '../controllers/UserController/UserSubscriptionPlanController';
import { UserSavedJobsController } from '../controllers/UserController/UserSavedJobsController';
import { UserReportedJobController } from '../controllers/UserController/UserReportedJobController';


import { MongoUserRepository } from '../../infrastructure/repositories/MongoUserRepository';
import { MongoOtpRepository } from '../../infrastructure/repositories/MongoOtpRepository';
import { MongoJobRepository } from '../../infrastructure/repositories/MongoJobRepository';
import { MongoJobApplicationRepository } from '../../infrastructure/repositories/MongoJobApplicationRepository';
import { MongoReportedJobRepository } from '../../infrastructure/repositories/MongoReportedJobRepository';
import { MongoSubscriptionPlanRepository } from '../../infrastructure/repositories/MongoSubscriptionPlanRepository';


import { RegisterUserUseCase } from '../../application/use-cases/User/RegisterUserUseCase';
import { VerifyOtpUseCase } from '../../application/use-cases/User/VerifyOtpUseCase'
import { LoginUserUseCase } from '../../application/use-cases/User/LoginUserUseCase';
import { UserProfileUseCase } from '../../application/use-cases/User/UserProfileUseCase'; 
import { CheckIfBlockedUseCase } from '../../application/use-cases/User/CheckIfBlockedUseCase'; 
import { UserJobUseCase } from '../../application/use-cases/User/UserJobUseCase';
import { ReportedJobUseCase } from '../../application/use-cases/User/ReportedJobUseCase';
import { SubscriptionPlanUseCase } from '../../application/use-cases/User/SubscriptionPlanUseCase';
import { SavedJobsUseCase } from '../../application/use-cases/User/SavedJobsUseCase';
import { ForgotPasswordUseCase } from '../../application/use-cases/User/ForgotPasswordUseCase';

import { EmailService } from '../../infrastructure/services/EmailService';
import { AuthService } from '../../infrastructure/services/AuthService'

import { verifyAccessToken } from '../middlewares/VerifyToken'
import uploadToS3, { upload } from '../middlewares/uploadToS3'; // Import multer and uploadToS3
import { CheckIfBlockedMiddleware } from '../middlewares/checkIfBlocked'; // Import CheckIfBlockedMiddleware


const router = express.Router()

// Repository instances
const userRepository = new MongoUserRepository()
const otpRepository = new MongoOtpRepository()
const jobRepository = new MongoJobRepository()
const jobApplicationRepository = new MongoJobApplicationRepository()
const reportedJobRepository = new MongoReportedJobRepository()
const subscriptionPlanRepository = new MongoSubscriptionPlanRepository()


// Service instances
const emailService = new EmailService()
const authService = new AuthService()

// Use cases with dependency injection
const registerUserUseCase = new RegisterUserUseCase(userRepository, otpRepository, emailService)
const verifyOtpUseCase = new VerifyOtpUseCase(otpRepository, userRepository)
const loginUserUseCase = new LoginUserUseCase(userRepository, authService)
const userProfileUseCase = new UserProfileUseCase(userRepository); 
const checkIfBlockedUseCase = new CheckIfBlockedUseCase(userRepository)
const userJobUseCase = new UserJobUseCase(jobRepository, userRepository, jobApplicationRepository)
const subscriptionPlanUseCase = new SubscriptionPlanUseCase(userRepository, subscriptionPlanRepository)
const savedJobsUseCase = new SavedJobsUseCase(jobRepository, userRepository)
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, authService, emailService)
const reportedJobUseCase = new ReportedJobUseCase(userRepository, jobRepository, reportedJobRepository)


// Controller with injected use cases and services
const userAuthController = new UserAuthController(registerUserUseCase, verifyOtpUseCase, loginUserUseCase, forgotPasswordUseCase, authService)
const userProfileController = new UserProfileController(userProfileUseCase);  
const userJobController = new UserJobController(userJobUseCase)
const userSubscriptionPlanController  = new UserSubscriptionPlanController(subscriptionPlanUseCase)
const userSavedJobsController = new UserSavedJobsController(savedJobsUseCase)
const userReportedJobController = new UserReportedJobController(reportedJobUseCase)


const checkIfBlockedMiddleware = new CheckIfBlockedMiddleware(checkIfBlockedUseCase)


// Authentication routes
router.post('/callback', userAuthController.handleCallback)
router.post('/register', userAuthController.register)
router.post('/verify-otp', userAuthController.verifyOtp)
router.get('/resend-otp', userAuthController.resendOtp)
router.post('/forgotPassword', userAuthController.forgotPassword)
router.post('/resetPassword', userAuthController.resetPassword)
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

router.get('/jobs/active', userJobController.getActiveJobs);
router.get('/job/:jobId', userJobController.getJobDetails)
router.get('/applyJob/:jobId',verifyAccessToken, userJobController.applyJob)
router.get('/appliedJobs', verifyAccessToken, userJobController.getAppliedJobs)

router.get('/savedJobs', verifyAccessToken, userSavedJobsController.getSavedJobs)
router.post('/saveJob/:jobId', verifyAccessToken, userSavedJobsController.saveJob)
router.post('/unsaveJob/:jobId', verifyAccessToken, userSavedJobsController.removeSavedJob)
router.get('/isJobSaved/:jobId', verifyAccessToken, userSavedJobsController.isJobSaved)

router.post('/reportJob', verifyAccessToken, userReportedJobController.reportJob)

router.post('/create-payment', verifyAccessToken, userSubscriptionPlanController.createPayment);
router.post('/verify-payment', verifyAccessToken, userSubscriptionPlanController.verifyPayment);

router.get('/subscriptions', verifyAccessToken, userSubscriptionPlanController.getSubscriptionPlans)
router.get('/subscriptions/:subscriptionId', verifyAccessToken, userSubscriptionPlanController.getSubscriptionPlanById)
router.get('/subscription-status', verifyAccessToken, userSubscriptionPlanController.getSubscriptionStatus)

export default router