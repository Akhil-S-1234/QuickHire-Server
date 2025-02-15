import { UserRepository } from '@domain/repositories/UserRepository';
import { JobRepository } from '../../../domain/repositories/JobRepository';
import { JobApplicationRepository } from '@domain/repositories/JobApplicationRepository';

export class UserJobUseCase {
    constructor(
        private jobRepository: JobRepository,
        private userRepository: UserRepository,
        private jobApplicationRepository: JobApplicationRepository
    ) { }

    async getActiveJobs(): Promise<any> {
        try {
            // Find jobs by postedBy (email) and filter for active jobs
            const activeJobs = await this.jobRepository.getActiveJobs();
            return activeJobs;
        } catch (error) {
            throw new Error('Error fetching active jobs');
        }
    }


    async getJobDetails(jobId: string): Promise<any> {
        // Assuming the job repository has a method to fetch jobs by recruiter (email)
        return await this.jobRepository.getJobId(jobId);
    }

    async applyToJob(email: string, jobId: string): Promise<any> {
        try {
            // Fetch the user by email
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
    
            // Fetch the job by ID
            const job = await this.jobRepository.getJobId(jobId);
            if (!job) {
                throw new Error('Job not found');
            }
    
            // Check for existing application
            const existingApplication = await this.jobApplicationRepository.getApplication(jobId, user.id);
            if (existingApplication) {
                throw new Error('Already applied to this job');
            }
    
            // Create a new application
            const newApplication = await this.jobApplicationRepository.createApplication(jobId, user.id);
    
            // Return the new application
            return newApplication;
        } catch (error: any) {
            // Handle errors appropriately (e.g., log them or rethrow them)
            console.error('Error in applyToJob:', error.message);
            throw new Error(error.message); // Propagate the error to the caller
        }
    }

    async appliedJobs(email: string): Promise<any> {
        try {
            // Fetch the user by email
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }

            const appliedJobs = await this.jobApplicationRepository.getAppliedJobs(user.id)

            if(!appliedJobs) {
                throw new Error('Applied jobs not found')
            }

            return appliedJobs
        } catch (error) {
            throw new Error('Error fetching applied jobs');
        }
    }
    
}