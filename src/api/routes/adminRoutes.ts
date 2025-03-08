// /api/routes/adminRoutes.ts
import { Router } from 'express';

import { AdminAuthController } from '../controllers/AdminController/AdminAuthController';
import { AdminManageController } from '../controllers/AdminController/AdminManagementController';
import { AdminReportedJobController } from '../controllers/AdminController/AdminReportedJobController';
import { AdminSubscriptionPlanController } from '../controllers/AdminController/AdminSubscriptionPlanController';
import { SendNotificationController } from '../controllers/NotificationController/SendNotificationController'

import { MongoAdminRepository } from '../../infrastructure/repositories/MongoAdminRepository';
import { MongoUserRepository } from '../../infrastructure/repositories/MongoUserRepository';
import { MongoRecruiterRepository } from '../../infrastructure/repositories/MongoRecruiterRepository';
import { MongoReportedJobRepository } from '../../infrastructure/repositories/MongoReportedJobRepository';
import { MongoSubscriptionPlanRepository } from '../../infrastructure/repositories/MongoSubscriptionPlanRepository';
import { MongoJobRepository } from '../../infrastructure/repositories/MongoJobRepository';
import { MongoNotificationRepository } from '../../infrastructure/repositories/MongoNotificationRepository';


import { GetAllUsersUseCase } from '../../application/use-cases/Admin/GetAllUsersUseCase';
import { LoginAdminUseCase } from '../../application/use-cases/Admin/LoginAdminUseCase';
import { ToggleBlockUseCase } from '../../application/use-cases/Admin/ToggleBlockUseCase';
import { VerifyRecruiterUseCase } from '../../application/use-cases/Admin/VerifyRecruiterUseCase';
import { ReportedJobUseCase } from '../../application/use-cases/Admin/ReportedJobUseCase';
import { SubscriptionPlanUseCase } from '../../application/use-cases/Admin/SubscriptionPlanUseCase';
import { SendNotificationUseCase } from '../../application/use-cases/Notification/SendNotificationUseCase';

import { AuthService } from '../../infrastructure/services/AuthService';
import { EmailService } from "../../infrastructure/services/EmailService";
import { RazorpayService } from '../../infrastructure/services/RazorpayService';

import { verifyAccessToken } from '../middlewares/VerifyToken'
import { authorize } from '../middlewares/authorize';

const router = Router();

const ADMIN_ROLE = 'admin';

// Create auth middleware array for DRY principle
const adminAuth = [verifyAccessToken(ADMIN_ROLE), authorize(ADMIN_ROLE)];


// Set up dependency injection for the use case and controller
const authService = new AuthService();
const emailService = new EmailService()
const razorpayService = new RazorpayService()

const adminRepository = new MongoAdminRepository();
const userRepository = new MongoUserRepository()
const recruiterRepository = new MongoRecruiterRepository()
const reportedJobRepository = new MongoReportedJobRepository()
const subscriptionPlanRepository = new MongoSubscriptionPlanRepository()
const jobRepository = new MongoJobRepository()
const notificationRepository = new MongoNotificationRepository()



const getAllUsersUseCase = new GetAllUsersUseCase(userRepository, recruiterRepository)
const toggleBlockUseCase = new ToggleBlockUseCase(userRepository, recruiterRepository)
const verifyRecruiterUseCase = new VerifyRecruiterUseCase(recruiterRepository, emailService)
const reportedJobUseCase = new ReportedJobUseCase(reportedJobRepository, jobRepository)
const checkAdminPassword = new LoginAdminUseCase(adminRepository, authService);
const subscriptionPlanUseCase = new SubscriptionPlanUseCase(subscriptionPlanRepository, razorpayService)
const sendNotificationUseCase = new SendNotificationUseCase(notificationRepository)

const adminAuthController = new AdminAuthController(checkAdminPassword, authService);
const adminManageController = new AdminManageController(verifyRecruiterUseCase, getAllUsersUseCase, toggleBlockUseCase)
const adminReportedJobController = new AdminReportedJobController(reportedJobUseCase)
const adminSubscriptionPlanController = new AdminSubscriptionPlanController(subscriptionPlanUseCase)
const sendNotificationController = new SendNotificationController(sendNotificationUseCase)

router.post('/login', adminAuthController.login);
router.post('/logout', adminAuthController.logout);

router.get('/users', ...adminAuth, adminManageController.getAllUsers)
router.put('/users/:userId', ...adminAuth, adminManageController.toggleBlockUser)

router.get('/recruiters', ...adminAuth, adminManageController.getAllActiveRecruiters)
router.put('/recruiters/:recruiterId', ...adminAuth, adminManageController.toggleBlockRecruiter)
router.get('/unverified-recruiters', ...adminAuth, adminManageController.getAllUnverifiedRecrutiers)
router.post('/verify-recruiter/:id', ...adminAuth, adminManageController.verifyRecruiter)

router.post('/subscriptionPlans', ...adminAuth, adminSubscriptionPlanController.createSubscriptionPlan)
router.get('/subscriptionPlans', ...adminAuth, adminSubscriptionPlanController.getAllSubscriptionPlans)
router.delete('/subscriptionPlans/:subscriptionPlanId', ...adminAuth, adminSubscriptionPlanController.deleteSubscriptionPlan)
router.put('/subscriptionPlans/:subscriptionPlanId', ...adminAuth, adminSubscriptionPlanController.updateSubscriptionPlan)

router.get('/reported-jobs/:id?', ...adminAuth, adminReportedJobController.getAllReports)
router.post('/reported-jobs/:id/toggle-visibility', ...adminAuth, adminReportedJobController.updateReportStatus)

router.post('/notifications', ...adminAuth, sendNotificationController.handle)

export default router;
