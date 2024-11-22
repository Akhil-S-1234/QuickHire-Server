import { AdminRepository } from '../../domain/repositories/AdminRepository'
// import { User, UserProfile } from '../../domain/entities/User'
// import { UpdateUserDTO } from '../../application/dtos/User/UpdateUserProfileDto'

import AdminModel from '../database/models/AdminModel'

export class MongoAdminRepository implements AdminRepository {

    async findByEmail(email: string): Promise<{email: string, password: string} | null> {
        
        const user  = await AdminModel.findOne({ email })
        return user
        ? {
            email: user.email,
            password: user.password
        }
        : null;
    }

}