// /api/routes/adminRoutes.ts
import { Router } from 'express';
import { AdminAuthController } from '../controllers/AdminController/AdminAuthController';
import { AdminManageController } from '../controllers/AdminController/AdminManagementController';

import { MongoAdminRepository } from '../../infrastructure/respositories/MongoAdminRepository';
import { MongoUserRepository } from '../../infrastructure/respositories/MongoUserRepository';
import { MongoRecruiterRepository } from '../../infrastructure/respositories/MongoRecruiterRepository';


import { GetAllUsersUseCase } from '../../application/use-cases/Admin/GetAllUsersUseCase';
import { LoginAdminUseCase } from '../../application/use-cases/Admin/LoginAdminUseCase';
import { ToggleBlockUseCase } from '../../application/use-cases/Admin/ToggleBlockUseCase';

import { AuthService } from '../../infrastructure/services/AuthService';

const router = Router();

// Set up dependency injection for the use case and controller
const authService = new AuthService();
const adminRepository = new MongoAdminRepository();
const userRepository = new MongoUserRepository()
const recruiterRepository = new MongoRecruiterRepository()

const getAllUsersUseCase = new GetAllUsersUseCase(userRepository, recruiterRepository)
const toggleBlockUseCase = new ToggleBlockUseCase(userRepository, recruiterRepository)

const checkAdminPassword = new LoginAdminUseCase(adminRepository, authService);

const adminAuthController = new AdminAuthController(checkAdminPassword, authService);
const adminManageController = new AdminManageController(getAllUsersUseCase, toggleBlockUseCase)

router.post('/login', adminAuthController.login);

router.get('/users', adminManageController.getAllUsers)
router.put('/users/:userId', adminManageController.toggleBlockUser)
router.get('/recruiters', adminManageController.getAllRecruiters)
router.put('/recruiters/:recruiterId', adminManageController.toggleBlockRecruiter)

export default router;
