import express, { Request, Response, NextFunction } from 'express';
import JobApplication from '../../infrastructure/database/models/JobApplicationModel';
import Job from '../../infrastructure/database/models/JobModel';
import User from '../../infrastructure/database/models/UserModel';
import { verifyAccessToken } from '../middlewares/VerifyToken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// router.get('/saved/:id', verifyAccessToken, 
//     async (req: Request, res: Response): Promise<void> => {
//     const email = (req as Request & { user?: string }).user;
//     const jobId = req.params.id;

//     try {
//         const user = await User.findOne({ email }).populate('savedJobs');
//         console.log(user)
//         if (!user) {
//             res.status(404).json({ message: 'User not found' });
//             return;
//         }

//         let savedJobs = user.savedJobs

//         const isSaved =  false;
//         res.json({ isSaved });
//     } catch (error) {
//         console.error('Error checking saved status:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// router.post('/save/:id', verifyAccessToken, 
//     async (req: Request, res: Response): Promise<void> => {
//     const email = (req as Request & { user?: string }).user;
//     const jobId = req.params.id;

//     try {
//         const job = await Job.findById(jobId);
//         if (!job) {
//             res.status(404).json({ message: 'Job not found' });
//             return;
//         }

//         const user = await User.findOneAndUpdate(
//           { email },
//           { $push: { savedJobs: { type: jobId, ref: 'Job' } } },  // Simply push the jobId to savedJobs
//           { new: true }
//         );

//         if (!user) {
//             res.status(404).json({ message: 'User not found or job already saved' });
//             return;
//         }

//         res.json({ message: 'Job saved successfully' });
//     } catch (error) {
//         console.error('Error saving job:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// router.post('/unsave/:id', verifyAccessToken, 
//     async (req: Request, res: Response): Promise<void> => {
//     const email = (req as Request & { user?: string }).user;
//     const jobId = req.params.id;

//     try {
//         const user = await User.findOneAndUpdate(
//             { email },
//             { $pull: { savedJobs: { type: jobId } } },
//             { new: true }
//         );

//         if (!user) {
//             res.status(404).json({ message: 'User not found' });
//             return;
//         }

//         res.json({ message: 'Job removed from saved jobs' });
//     } catch (error) {
//         console.error('Error removing saved job:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });



router.post('/password-reset', verifyAccessToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { oldPassword, newPassword } = req.body;
  const email = (req as Request & { user?: string }).user;

  if (!oldPassword || !newPassword) {
    res.status(400).json({ message: 'Please provide all fields: oldPassword, newPassword, and confirmNewPassword' });
    return;
  }


  if (newPassword.length < 8) {
    res.status(400).json({ message: 'New password must be at least 8 characters long' });
    return;
  }

  try {
    // Fetch user by email
    const user = await User.findOne({ email });

    console.log(user)
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Verify the old password
    const isOldPasswordValid = user.password ? await bcrypt.compare(oldPassword, user.password) : false;
    if (!isOldPasswordValid) {
      res.status(401).json({ message: 'Old password is incorrect' });
      return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Send a success response
    res.status(200).json({ message: 'Password successfully reset' });

  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
export default router;
