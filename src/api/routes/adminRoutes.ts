// /api/routes/adminRoutes.ts
import { Router } from 'express';

import { AdminAuthController } from '../controllers/AdminController/AdminAuthController';
import { AdminManageController } from '../controllers/AdminController/AdminManagementController';
import { AdminReportedJobController } from '../controllers/AdminController/AdminReportedJobController';
import { AdminSubscriptionController } from '../controllers/AdminController/AdminSubscriptionController';


import { MongoAdminRepository } from '../../infrastructure/repositories/MongoAdminRepository';
import { MongoUserRepository } from '../../infrastructure/repositories/MongoUserRepository';
import { MongoRecruiterRepository } from '../../infrastructure/repositories/MongoRecruiterRepository';
import { MongoReportedJobRepository } from '../../infrastructure/repositories/MongoReportedJobRepository';
import { MongoSubscriptionRepository } from '../../infrastructure/repositories/MongoSubscriptionRepository';
import { MongoJobRepository } from '../../infrastructure/repositories/MongoJobRepository';


import { GetAllUsersUseCase } from '../../application/use-cases/Admin/GetAllUsersUseCase';
import { LoginAdminUseCase } from '../../application/use-cases/Admin/LoginAdminUseCase';
import { ToggleBlockUseCase } from '../../application/use-cases/Admin/ToggleBlockUseCase';
import { VerifyRecruiterUseCase } from '../../application/use-cases/Admin/VerifyRecruiterUseCase';
import { ReportedJobUseCase } from '../../application/use-cases/Admin/ReportedJobUseCase';
import { SubscriptionUseCase } from '../../application/use-cases/Admin/SubscriptionUseCase';

import { AuthService } from '../../infrastructure/services/AuthService';
import { EmailService } from "../../infrastructure/services/EmailService";

import { verifyAccessToken } from '../middlewares/VerifyToken'

const router = Router();

// Set up dependency injection for the use case and controller
const authService = new AuthService();
const emailService = new EmailService()

const adminRepository = new MongoAdminRepository();
const userRepository = new MongoUserRepository()
const recruiterRepository = new MongoRecruiterRepository()
const reportedJobRepository = new MongoReportedJobRepository()
const subscriptionRepository = new MongoSubscriptionRepository()
const jobRepository = new MongoJobRepository()



const getAllUsersUseCase = new GetAllUsersUseCase(userRepository, recruiterRepository)
const toggleBlockUseCase = new ToggleBlockUseCase(userRepository, recruiterRepository)
const verifyRecruiterUseCase = new VerifyRecruiterUseCase(recruiterRepository, emailService)
const reportedJobUseCase = new ReportedJobUseCase(reportedJobRepository, jobRepository)
const checkAdminPassword = new LoginAdminUseCase(adminRepository, authService);
const subscriptionUseCase = new SubscriptionUseCase(subscriptionRepository)

const adminAuthController = new AdminAuthController(checkAdminPassword, authService);
const adminManageController = new AdminManageController(verifyRecruiterUseCase, getAllUsersUseCase, toggleBlockUseCase)
const adminReportedJobController = new AdminReportedJobController(reportedJobUseCase)
const adminSubscriptionController = new AdminSubscriptionController(subscriptionUseCase)

router.post('/login', adminAuthController.login);
router.post('/logout', adminAuthController.logout);

router.get('/users', verifyAccessToken, adminManageController.getAllUsers)
router.put('/users/:userId', verifyAccessToken,adminManageController.toggleBlockUser)

router.get('/recruiters', verifyAccessToken, adminManageController.getAllActiveRecruiters)
router.put('/recruiters/:recruiterId', verifyAccessToken,adminManageController.toggleBlockRecruiter)
router.get('/unverified-recruiters', verifyAccessToken, adminManageController.getAllUnverifiedRecrutiers)
router.post('/verify-recruiter/:id', verifyAccessToken, adminManageController.verifyRecruiter)

router.get('/subscriptions', verifyAccessToken, adminSubscriptionController.getAllSubscriptions)
router.put('/subscriptions/:subscriptionId', verifyAccessToken, adminSubscriptionController.updateSubscriptionPrice)

router.get('/reported-jobs/:id?', verifyAccessToken, adminReportedJobController.getAllReports)
router.post('/reported-jobs/:id/toggle-visibility', verifyAccessToken, adminReportedJobController.updateReportStatus)

export default router;
