


// export class RecruiterJobUseCase {
//     constructor( 

//     ) {}

//     async execute(job: string): Promise<void> {

//     }
// }

import { JobRepository } from '../../../domain/repositories/JobRepository';

export class RecruiterJobUseCase {
    constructor(private jobRepository: JobRepository) {}

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

    async getActiveJobs(): Promise<any> {
        try {
            // Find jobs by postedBy (email) and filter for active jobs
            const activeJobs = await this.jobRepository.getActiveJobs();
            return activeJobs;
        } catch (error) {
            throw new Error('Error fetching active jobs');
        }
    }
}
