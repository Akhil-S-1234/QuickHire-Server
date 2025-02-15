import { UserRepository } from '@domain/repositories/UserRepository';
import { JobRepository } from '../../../domain/repositories/JobRepository';

export class SavedJobsUseCase {

    constructor(
        private jobRepository: JobRepository,
        private userRepository: UserRepository
    ) { }

    async saveJob(userEmail: string, jobId: string): Promise<void> {

        const user = await this.userRepository.findProfileByEmail(userEmail);
        if (!user) {
            throw new Error('User not found');
        }

        const job = await this.jobRepository.getJobById(jobId);
        if (!job) {
            throw new Error('Job not found');
        }

        if (!user.savedJobs) {
            user.savedJobs = [];
        }

        if (user.savedJobs.includes(jobId)) {
            throw new Error('Job already saved');
        }

        let savedJobs = user.savedJobs.push(jobId);

        await this.userRepository.updateUserProfile(userEmail, { savedJobs: user.savedJobs });
    }

    async getSavedJobs(email: string): Promise<any> {

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const savedJobs = await this.userRepository.getSavedJobs(user.id)

        return savedJobs
    }

    async removeSavedJob(email: string, jobId: string): Promise<void> {

        const user = await this.userRepository.findProfileByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        if (!user.savedJobs || !user.savedJobs.includes(jobId)) {
            throw new Error('Job not found in saved jobs');
        }

        user.savedJobs = user.savedJobs.filter((id: string) => id !== jobId);

        await this.userRepository.updateUserProfile(email, { savedJobs: user.savedJobs });
    }

    async isJobSaved(email: string, jobId: string): Promise<boolean> {

        const user = await this.userRepository.findProfileByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        return user.savedJobs ? user.savedJobs.includes(jobId) : false;

    }


}