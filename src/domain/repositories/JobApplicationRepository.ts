
export interface JobApplicationRepository {

    getApplicationsByjobId(jobId: string): Promise<any>;
    changeApplicantStatus(applicantId: string, status: string): Promise<any>;
    getApplication(jobId: string, userId: string): Promise<any>;
    createApplication(jobId: string, userId: string): Promise<any>;
    getAppliedJobs(userId: string): Promise<any>;
}