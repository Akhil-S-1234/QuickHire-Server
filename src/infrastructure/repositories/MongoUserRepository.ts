import { UserRepository } from '../../domain/repositories/UserRepository'
import { User, UserProfile } from '../../domain/entities/User'
import { UpdateUserDTO } from '../../application/dtos/User/UpdateUserProfileDto'
import { razorpay } from '../../config/razorpay';
import UserModel from '../database/models/UserModel'
import crypto from 'crypto';


export class MongoUserRepository implements UserRepository {

    async findByEmail(email: string): Promise<User | null> {

        const user = await UserModel.findOne({ email })
        return user
            ? new User(
                user.id?.toString() ?? '',  // Convert ID to string
                user.firstName,
                user.lastName ?? '',         // Fallback for lastName
                user.email,                  // Email is required, no fallback needed
                user.phoneNumber ?? '',      // Fallback for phoneNumber
                user.password ?? '',
                user.profilePicture ?? '',
                user.isBlocked ?? '',
                user.createdAt ?? new Date() // Fallback for createdAt
            )
            : null;
    }

    async findById(userId: string): Promise<User | null> {

        // const user  = await UserModel.findOne({ userId })
        const user = await UserModel.findById(userId)
        console.log(user)
        return user
            ? new User(
                user.id?.toString() ?? '',  // Convert ID to string
                user.firstName,
                user.lastName ?? '',         // Fallback for lastName
                user.email,                  // Email is required, no fallback needed
                user.phoneNumber ?? '',      // Fallback for phoneNumber
                user.password ?? '',
                user.profilePicture ?? '',      // Fallback for password
                user.isBlocked ?? '',
                user.createdAt ?? new Date() // Fallback for createdAt
            )
            : null;
    }

    async save(user: User): Promise<any> {

        const userRecord = new UserModel(user)
        const savedUser = await userRecord.save();

        return {
            userId: savedUser.id.toString(),
            name: savedUser.firstName,
            email: savedUser.email,
        }; 

    }

    async findProfileByEmail(email: string): Promise<UserProfile | null> {
        const user = await UserModel.findOne({ email });

        if (!user) return null;

        return new UserProfile(
            user.id.toString(),
            user.firstName,
            user.lastName ?? '',
            user.email,
            user.phoneNumber ?? '',
            user.profilePicture ?? '',
            user.isFresher,
            user.resume ?? '',
            user.skills ?? [],
            user.experience ?? [],
            user.education ?? [],
            user.city ?? '',
            user.state ?? '',
            user.isBlocked,
            user.createdAt,
            user.updatedAt ?? new Date(),
            user.subscription ? {
                type: user.subscription.type,
                startDate: user.subscription.startDate,
                endDate: user.subscription.endDate,
                isActive: user.subscription.isActive
            } : undefined,
            user.savedJobs?.map(job => job.toString())
        );
    }

    async getAllUsers(): Promise<UserProfile[]> {
        const users = await UserModel.find();

        return users.map(user => new UserProfile(
            user.id.toString(),
            user.firstName,
            user.lastName ?? '',
            user.email,
            user.phoneNumber ?? '',
            user.profilePicture ?? '',
            user.isFresher,
            user.resume ?? '',
            user.skills ?? [],
            user.experience ?? [],
            user.education ?? [],
            user.city ?? '',
            user.state ?? '',
            user.isBlocked,
            user.createdAt,
            user.updatedAt ?? new Date(),
            user.subscription ? {
                type: user.subscription.type,
                startDate: user.subscription.startDate,
                endDate: user.subscription.endDate,
                isActive: user.subscription.isActive
            } : undefined,
            user.savedJobs?.map(job => job.toString())
        ));
    }

    async updateUserProfile(email: string, updates: UpdateUserDTO): Promise<UserProfile | null> {
        const result = await UserModel.updateOne(
            { email },          // Filter by email
            { $set: updates }   // Apply partial updates
        );

        if (result.modifiedCount === 0) {
            return null;
        }

        const user = await UserModel.findOne({ email });

        if (!user) return null;

        return new UserProfile(
            user.id.toString(),
            user.firstName,
            user.lastName ?? '',
            user.email,
            user.phoneNumber ?? '',
            user.profilePicture ?? '',
            user.isFresher,
            user.resume ?? '',
            user.skills ?? [],
            user.experience ?? [],
            user.education ?? [],
            user.city ?? '',
            user.state ?? '',
            user.isBlocked,
            user.createdAt,
            user.updatedAt ?? new Date(),
            user.subscription ? {
                type: user.subscription.type,
                startDate: user.subscription.startDate,
                endDate: user.subscription.endDate,
                isActive: user.subscription.isActive
            } : undefined,
            user.savedJobs?.map(job => job.toString())
        );
    }

    async getSubscriptionDetails(email: string): Promise<any> {
        try {
            const user = await UserModel.findOne(
                { email },
                {
                    subscription: {
                        type: 1,
                        startDate: 1,
                        endDate: 1,
                        isActive: 1,
                    }
                }
            );

            return user?.subscription || null; // Return only the subscription details
        } catch (error: any) {
            throw new Error(`Failed to fetch subscription details: ${error.message}`);
        }
    }

    async getSavedJobs(userId: string): Promise<any> {
        try {

            const user = await UserModel.findById(userId).populate('savedJobs');

            if(!user) {
                throw new Error('User not found')
            }

            return user.savedJobs

        } catch (error: any) {
            throw new Error(`Failed to fetch saved jobs: ${error.message}`)
        }
    }


}