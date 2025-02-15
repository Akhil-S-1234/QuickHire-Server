import express from 'express';

import { RecruiterAuthController } from '../controllers/RecruiterController/RecruiterAuthController'
import { RecruiterProfileController } from '../controllers/RecruiterController/RecruiterProfileController';
import { RecruiterJobController } from '../controllers/RecruiterController/RecruiterJobController'
import { RecruiterInterviewController } from '../controllers/RecruiterController/RecruiterInterviewController'

import { MongoRecruiterRepository } from '../../infrastructure/repositories/MongoRecruiterRepository';
import { MongoOtpRepository } from '../../infrastructure/repositories/MongoOtpRepository';
import { MongoJobRepository } from '../../infrastructure/repositories/MongoJobRepository';
import { MongoJobApplicationRepository } from '../../infrastructure/repositories/MongoJobApplicationRepository';
import { MongoInterviewRepository } from '../../infrastructure/repositories/MongoInterviewRepository';

import { RegisterRecruiterUseCase } from '../../application/use-cases/Recruiter/RegisterRecruiterUseCase';
import { VerifyOtpRecruiterUseCase } from '../../application/use-cases/Recruiter/VerifyRecruiterUseCase';
import { LoginRecruiterUseCase } from '../../application/use-cases/Recruiter/LoginRecruiterUseCase';
import { RecruiterProfileUseCase } from '../../application/use-cases/Recruiter/RecruiterProfileUseCase';
import { RecruiterJobUseCase } from '../../application/use-cases/Recruiter/RecruiterJobUseCase';
import { ScheduleInterviewUseCase } from '../../application/use-cases/Recruiter/ScheduleInterviewUseCase';


import { EmailService } from '../../infrastructure/services/EmailService';
import { AuthService } from '../../infrastructure/services/AuthService';

import { verifyAccessToken } from '../middlewares/VerifyToken';
import uploadToS3, { upload } from '../middlewares/uploadToS3'; // Import multer and uploadToS3
import JobApplicationModel from '@infrastructure/database/models/JobApplicationModel';

const router = express.Router();

// Repository instances
const recruiterRepository = new MongoRecruiterRepository();
const otpRepository = new MongoOtpRepository();
const jobRepository = new MongoJobRepository()
const jobApplicationRepository = new MongoJobApplicationRepository();
const interviewRepository = new MongoInterviewRepository()

// Service instances
const emailService = new EmailService();
const authService = new AuthService();

// Use cases with dependency injection
const registerRecruiterUseCase = new RegisterRecruiterUseCase(recruiterRepository, otpRepository, emailService);
const verifyOtpUseCase = new VerifyOtpRecruiterUseCase(otpRepository, recruiterRepository);
const loginRecruiterUseCase = new LoginRecruiterUseCase(recruiterRepository, authService);
const recruiterProfileUseCase = new RecruiterProfileUseCase(recruiterRepository);
const recruiterJobUseCase = new RecruiterJobUseCase(jobRepository, jobApplicationRepository)
const scheduleInterviewUseCase = new ScheduleInterviewUseCase(recruiterRepository, interviewRepository)

// Controller with injected use cases and services
const recruiterAuthController = new RecruiterAuthController(registerRecruiterUseCase, verifyOtpUseCase, loginRecruiterUseCase, authService);
const recruiterProfileController = new RecruiterProfileController(recruiterProfileUseCase);
const recruiterJobController = new RecruiterJobController(recruiterJobUseCase)
const recruiterInterviewController = new RecruiterInterviewController(scheduleInterviewUseCase)

// Authentication routes
router.post('/register', upload.single('photo'), uploadToS3, recruiterAuthController.register);
router.post('/verify-otp', recruiterAuthController.verifyOtp);
router.get('/resend-otp', recruiterAuthController.resendOtp);
router.post('/login', recruiterAuthController.login);
router.post('/logout', verifyAccessToken, recruiterAuthController.logout);
router.get('/refreshtoken', recruiterAuthController.refreshToken);

// Recruiter profile routes
router.get('/profile', verifyAccessToken, recruiterProfileController.getProfile)
router.put('/profile', verifyAccessToken, recruiterProfileController.getProfile)

// Job post routes
router.post('/postjob', verifyAccessToken, recruiterJobController.postJob)
router.get('/jobs', verifyAccessToken, recruiterJobController.getJob)
router.put('/jobs/:jobId', verifyAccessToken, recruiterJobController.changeJobStatus)
// router.get('/jobs/active', recruiterJobController.getActiveJobs);
// router.get('/job/:jobId', recruiterJobController.getJobDetails)
router.get('/jobs/applications/:jobId', verifyAccessToken, recruiterJobController.getJobApplications)
router.put('/jobs/applications/:applicantId', verifyAccessToken, recruiterJobController.changeApplicantStatus)

router.post('/scheduleInterview', verifyAccessToken, recruiterInterviewController.scheduleInterview)



export default router;
