import { UpdateUserDTO } from '../../application/dtos/User/UpdateUserProfileDto'
import { User, UserProfile } from '../entities/User'

export interface UserRepository {

    findByEmail(email : string): Promise< User | null>
    findById(userId : string): Promise< User | null>
    getAllUsers(): Promise<UserProfile[]>;
    findProfileByEmail(email : string): Promise< UserProfile | null>
    save(user: User): Promise<void>
    updateUserProfile(email : string, updates: UpdateUserDTO): Promise< UserProfile | null>
    createPayment(payment: any): Promise<any>;
    verifyPayment(subscription: any, email: string): Promise<boolean>;
    getSubscriptionDetails(email:string): Promise<any>
    getSavedJobs(userId: string): Promise<any>
}