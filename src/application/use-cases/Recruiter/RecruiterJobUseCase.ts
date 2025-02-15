
import { JobRepository } from '../../../domain/repositories/JobRepository';
import { JobApplicationRepository } from '../../../domain/repositories/JobApplicationRepository';

export class RecruiterJobUseCase {
    constructor(
        private jobRepository: JobRepository,
        private jobApplicationRepository: JobApplicationRepository
    ) {}

    async execute(job: any): Promise<any> {
        return await this.jobRepository.createJob(job);
    }

    async getJobsByRecruiter(email: string): Promise<any> {
        // Assuming the job repository has a method to fetch jobs by recruiter (email)
        return await this.jobRepository.getJobById(email);
    }


    async changeJobStatus(jobId: string, isActive: Boolean): Promise<any> {
        try {
            // Find the job by ID and update its status
            const updatedJob = await this.jobRepository.updateJob(jobId, isActive);
            return updatedJob;
        } catch (error: any) {
            throw new Error('Failed to update job status: ' + error.message);
        }
    }

    async getJobApplications(jobId: string ): Promise<any> {
        try {
            // Find the job by ID and update its status
            const applications = await this.jobApplicationRepository.getApplicationsByjobId(jobId);
            return applications;
        } catch (error: any) {
            throw new Error('Failed to update job status: ' + error.message);
        }
    }

    async changeApplicantStatus(applicantId: string, status: string ): Promise<any> {
        try {
            // Find the job by ID and update its status
            const updatedApplicant = await this.jobApplicationRepository.changeApplicantStatus(applicantId, status);
            return updatedApplicant;
        } catch (error: any) {
            throw new Error('Failed to update job status: ' + error.message);
        }
    }

  
}
