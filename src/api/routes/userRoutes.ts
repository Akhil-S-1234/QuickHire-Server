import express from 'express';

import { UserAuthController } from '../controllers/UserController/UserAuthController'
import { UserProfileController } from '../controllers/UserController/UserProfileController';
import { UserJobController } from '../controllers/UserController/UserJobController';
import { UserSubscriptionPlanController  } from '../controllers/UserController/UserSubscriptionPlanController';
import { UserSavedJobsController } from '../controllers/UserController/UserSavedJobsController';
import { UserReportedJobController } from '../controllers/UserController/UserReportedJobController';
import { UserSubscriptionController } from '../controllers/UserController/UserSubscriptionController';

import { MongoUserRepository } from '../../infrastructure/repositories/MongoUserRepository';
import { MongoOtpRepository } from '../../infrastructure/repositories/MongoOtpRepository';
import { MongoJobRepository } from '../../infrastructure/repositories/MongoJobRepository';
import { MongoJobApplicationRepository } from '../../infrastructure/repositories/MongoJobApplicationRepository';
import { MongoReportedJobRepository } from '../../infrastructure/repositories/MongoReportedJobRepository';
import { MongoSubscriptionPlanRepository } from '../../infrastructure/repositories/MongoSubscriptionPlanRepository';
import { MongoSubscriptionRepository } from '../../infrastructure/repositories/MongoSubscriptionRepository';


import { RegisterUserUseCase } from '../../application/use-cases/User/RegisterUserUseCase';
import { VerifyOtpUseCase } from '../../application/use-cases/User/VerifyOtpUseCase'
import { LoginUserUseCase } from '../../application/use-cases/User/LoginUserUseCase';
import { UserProfileUseCase } from '../../application/use-cases/User/UserProfileUseCase'; 
import { CheckIfBlockedUseCase } from '../../application/use-cases/User/CheckIfBlockedUseCase'; 
import { UserJobUseCase } from '../../application/use-cases/User/UserJobUseCase';
import { ReportedJobUseCase } from '../../application/use-cases/User/ReportedJobUseCase';
import { SubscriptionPlanUseCase } from '../../application/use-cases/User/SubscriptionPlanUseCase';
import { SubscriptionUseCase } from '../../application/use-cases/User/SubscriptionUseCase'
import { SavedJobsUseCase } from '../../application/use-cases/User/SavedJobsUseCase';
import { ForgotPasswordUseCase } from '../../application/use-cases/User/ForgotPasswordUseCase';

import { EmailService } from '../../infrastructure/services/EmailService';
import { AuthService } from '../../infrastructure/services/AuthService'
import { RazorpayService } from '../../infrastructure/services/RazorpayService';

import { authorize } from '../middlewares/authorize';
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
const subscriptionRepository = new MongoSubscriptionRepository()


// Service instances
const emailService = new EmailService()
const authService = new AuthService()
const razorpayService = new RazorpayService()

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
const subscriptionUseCase = new SubscriptionUseCase(userRepository, subscriptionRepository, razorpayService)

// Controller with injected use cases and services
const userAuthController = new UserAuthController(registerUserUseCase, verifyOtpUseCase, loginUserUseCase, forgotPasswordUseCase, authService)
const userProfileController = new UserProfileController(userProfileUseCase);  
const userJobController = new UserJobController(userJobUseCase)
const userSubscriptionPlanController  = new UserSubscriptionPlanController(subscriptionPlanUseCase)
const userSubscriptionController = new UserSubscriptionController(subscriptionUseCase)
const userSavedJobsController = new UserSavedJobsController(savedJobsUseCase)
const userReportedJobController = new UserReportedJobController(reportedJobUseCase)


const checkIfBlockedMiddleware = new CheckIfBlockedMiddleware(checkIfBlockedUseCase)

const JOB_SEEKER_ROLE = 'jobSeeker'

const jobSeekerAuth = [verifyAccessToken(JOB_SEEKER_ROLE), authorize(JOB_SEEKER_ROLE)]


// Authentication routes
router.post('/callback', userAuthController.handleCallback)
router.post('/register', userAuthController.register)
router.post('/verify-otp', userAuthController.verifyOtp)
router.get('/resend-otp', userAuthController.resendOtp)
router.post('/forgotPassword', userAuthController.forgotPassword)
router.post('/resetPassword', userAuthController.resetPassword)
router.post('/login', userAuthController.login)
router.post('/logout', ...jobSeekerAuth, userAuthController.logout)
router.get('/refreshtoken', userAuthController.refreshToken)


// User profile routes
router.get('/profile', ...jobSeekerAuth, checkIfBlockedMiddleware.checkIfBlocked, userProfileController.getProfile);
router.put('/profile', ...jobSeekerAuth, userProfileController.updateProfile)
router.post('/profile/skills', ...jobSeekerAuth, userProfileController.addSkill)
router.delete('/profile/skills/:skill', ...jobSeekerAuth, userProfileController.removeSkill)
router.post('/profile/photo', ...jobSeekerAuth, upload.single('photo'), uploadToS3 , userProfileController.addProfilePicture)
router.post('/profile/resume', ...jobSeekerAuth, upload.single('resume'), uploadToS3 , userProfileController.addresume)
router.post('/profile/education', ...jobSeekerAuth, userProfileController.addEducation)
router.delete('/profile/education/:educationId', ...jobSeekerAuth, userProfileController.removeEducation)
router.post('/profile/experience', ...jobSeekerAuth, userProfileController.addExperience)
router.delete('/profile/experience/:experienceId', ...jobSeekerAuth, userProfileController.removeExperience)

router.get('/jobs/active', userJobController.getActiveJobs);
router.get('/job/:jobId', userJobController.getJobDetails);
router.get('/applyJob/:jobId', ...jobSeekerAuth, userJobController.applyJob)
router.get('/appliedJobs', ...jobSeekerAuth, userJobController.getAppliedJobs)

router.get('/savedJobs', ...jobSeekerAuth, userSavedJobsController.getSavedJobs)
router.post('/saveJob/:jobId', ...jobSeekerAuth, userSavedJobsController.saveJob)
router.post('/unsaveJob/:jobId', ...jobSeekerAuth, userSavedJobsController.removeSavedJob)
router.get('/isJobSaved/:jobId', ...jobSeekerAuth, userSavedJobsController.isJobSaved)

router.post('/reportJob', ...jobSeekerAuth, userReportedJobController.reportJob)

router.get('/subscriptionPlans', ...jobSeekerAuth, userSubscriptionPlanController.getSubscriptionPlans)
router.get('/subscriptionPlans/:subscriptionPlanId', ...jobSeekerAuth, userSubscriptionPlanController.getSubscriptionPlanById)


router.get('/subscription', ...jobSeekerAuth, userSubscriptionController.getSubscriptionStatus)

router.post('/create-payment', ...jobSeekerAuth, userSubscriptionController.createPayment)
router.post('/activate-order', ...jobSeekerAuth, userSubscriptionController.activateOrder)
router.post('/activate-subscription', ...jobSeekerAuth, userSubscriptionController.activateSubscription)

router.post('/razorpayWebhook',userSubscriptionController.handleWebhook)

export default router