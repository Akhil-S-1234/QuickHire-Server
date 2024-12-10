import { JobRepository } from '../../domain/repositories/JobRepository';
import JobModel from '../database/models/JobModel';

export class MongoJobRepository implements JobRepository {
    async createJob(jobData: any): Promise<any> {
        return await JobModel.create(jobData);
    }

    async getJobById(email: string): Promise<any> {
        return await JobModel.find({ postedBy: email }); // Find all jobs posted by the recruiter using the postedBy field
    }

    async getActiveJobs(): Promise<any> {
        const activeJobs = await JobModel.find({
           isActive: true, // assuming 'status' field exists and identifies active jobs
        });

        return activeJobs;    }

    async updateJob(jobId: string, updateData: any): Promise<any> {
        console.log(updateData)
        updateData = { isActive: updateData}
        return await JobModel.findByIdAndUpdate(jobId, updateData, { new: true });
    }

    async deleteJob(jobId: string): Promise<any> {
        return await JobModel.findByIdAndDelete(jobId);
    }
}
