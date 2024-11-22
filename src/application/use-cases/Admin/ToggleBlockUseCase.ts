import { UserRepository } from '../../../domain/repositories/UserRepository';
import { RecruiterRepository } from '../../../domain/repositories/RecruiterRepository';
import { User, UserProfile } from '../../../domain/entities/User';
import { RecruiterProfile } from '../../../domain/entities/Recruiter';

export class ToggleBlockUseCase {
    constructor(private userRepository: UserRepository,
        private recruiterRepository: RecruiterRepository
    ) {}

    async toggleBlockUser(userId: string, isBlocked: Boolean): Promise<Boolean> {

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        const updatedProfile = await this.userRepository.updateUserProfile(user.email, { isBlocked: isBlocked });

        if (!updatedProfile) throw new Error('Failed to update profile');

        return true
    }

    async toggleBlockRecruiter(recruiterId: string, isBlocked: Boolean): Promise<Boolean> {

        const recruiter = await this.recruiterRepository.findById(recruiterId)
        if (!recruiter) {
            throw new Error(`Recruiter with ID ${recruiterId} not found`);
        }

        const updatedProfile = await this.recruiterRepository.updateRecruiterProfile(recruiter.email, { isBlocked: isBlocked })

        if (!updatedProfile) throw new Error('Failed to update profile');

        return true
    }
}
