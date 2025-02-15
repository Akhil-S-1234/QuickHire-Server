import { UserRepository } from '../../../domain/repositories/UserRepository'
import { JobRepository } from '../../../domain/repositories/JobRepository';
import { ReportedJobRepository } from '../../../domain/repositories/ReportedJobRepository';



export class ReportedJobUseCase {

    constructor(
        private userRepository: UserRepository,
        private jobRepository: JobRepository,
        private reportedJobRepository: ReportedJobRepository,

    ) { }

    async createJob(email: string, jobId: string, reportType: string, description: string): Promise<void> {
        // Validate if user exists
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        // Validate if job exists
        const job = await this.jobRepository.getJobById(jobId);
        if (!job) {
            throw new Error('Job not found');
        }

        // Check if the job is already reported by the user
        const existingReport = await this.reportedJobRepository.findByUserAndJob(user.id, jobId);
        if (existingReport) {
            throw new Error('Job already reported by this user');
        }

        // Create the reported job entry
        await this.reportedJobRepository.create({
            userId: user.id,
            jobId,
            reportType,
            description,
            reportedAt: new Date(),
        });

    }
}