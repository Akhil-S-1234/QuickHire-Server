
export interface JobRepository {
    createJob(jobData: any): Promise<any>;
    getJobById(jobId: string): Promise<any>;
    getActiveJobs(): Promise<any>;
    updateJob(jobId: string, updateData: any): Promise<any>;
    deleteJob(jobId: string): Promise<any>;
    getJobId(jobId: string): Promise<any>;

}
