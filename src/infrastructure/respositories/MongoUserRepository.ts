import { UserRepository } from '../../domain/repositories/UserRepository'
import { User, UserProfile } from '../../domain/entities/User'
import { UpdateUserDTO } from '../../application/dtos/User/UpdateUserProfileDto'

import UserModel from '../database/models/UserModel'

export class MongoUserRepository implements UserRepository {

    async findByEmail(email: string): Promise<User | null> {
        
        const user  = await UserModel.findOne({ email })
        return user
        ? new User(
            user.id?.toString() ?? '',  // Convert ID to string
            user.firstName, 
            user.lastName ?? '',         // Fallback for lastName
            user.email,                  // Email is required, no fallback needed
            user.phoneNumber ?? '',      // Fallback for phoneNumber
            user.password ?? '',   
            user.profilePicture ?? '',      // Fallback for password
            user.createdAt ?? new Date() // Fallback for createdAt
        )
        : null;
    }

    async findById(userId: string): Promise<User | null> {
        
        // const user  = await UserModel.findOne({ userId })
        const user  = await UserModel.findById(userId)
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
            user.createdAt ?? new Date() // Fallback for createdAt
        )
        : null;
    }

    async save(user: User): Promise<void> {

        const userRecord = new UserModel(user)
        await userRecord.save();
        
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
            user.updatedAt ?? new Date()   
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
            user.updatedAt ?? new Date()       // Fallback for phoneNumber
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
            user.updatedAt ?? new Date()   
        );
    }

}