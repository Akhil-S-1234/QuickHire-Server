import { RecruiterRepository } from '../../../domain/repositories/RecruiterRepository';
import { Recruiter, RecruiterProfile } from '../../../domain/entities/Recruiter'
import { RecruiterDTO } from '../../dtos/Recruiter/RecruiterProfileDto'
import { UpdateRecruiterDto } from '../../dtos/Recruiter/UpdateRecruiterProfileDto'

export class RecruiterProfileUseCase {
    constructor(private recruiterRepository: RecruiterRepository) {}

    async execute(email: string): Promise<RecruiterProfile> {
        const userProfile = await this.recruiterRepository.findProfileByEmail(email);

        if (!userProfile) throw new Error('User not found');

        return userProfile;
    }


    async update(email: string, updates: UpdateRecruiterDto): Promise<Recruiter> {
        
        const userProfile = await this.recruiterRepository.findByEmail(email);

        if (!userProfile) throw new Error('User not found');

        // Call the repository's update method to apply the changes
        const updatedProfile = await this.recruiterRepository.updateRecruiterProfile(email, updates);

        if (!updatedProfile) throw new Error('Failed to update profile');

        return updatedProfile;
    }
}