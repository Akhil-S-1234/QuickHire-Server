// import express, { Request, Response, NextFunction } from 'express';
// import JobApplication from '../../infrastructure/database/models/JobApplicationModel';
// import Job from '../../infrastructure/database/models/JobModel';
// import User from '../../infrastructure/database/models/UserModel';
// import { verifyAccessToken } from '../middlewares/VerifyToken';
// import bcrypt from 'bcryptjs';

// const router = express.Router();

// router.post('/password-reset', verifyAccessToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   const { oldPassword, newPassword } = req.body;
//   const email = (req as Request & { user?: string }).user;

//   if (!oldPassword || !newPassword) {
//     res.status(400).json({ message: 'Please provide all fields: oldPassword, newPassword, and confirmNewPassword' });
//     return;
//   }


//   if (newPassword.length < 8) {
//     res.status(400).json({ message: 'New password must be at least 8 characters long' });
//     return;
//   }

//   try {
//     // Fetch user by email
//     const user = await User.findOne({ email });

//     console.log(user)
//     if (!user) {
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }

//     // Verify the old password
//     const isOldPasswordValid = user.password ? await bcrypt.compare(oldPassword, user.password) : false;
//     if (!isOldPasswordValid) {
//       res.status(401).json({ message: 'Old password is incorrect' });
//       return;
//     }

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(newPassword, 12);

//     // Update the user's password
//     user.password = hashedPassword;
//     await user.save();

//     // Send a success response
//     res.status(200).json({ message: 'Password successfully reset' });

//   } catch (error) {
//     console.error('Error resetting password:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
// export default router;
