

export interface InterviewRepository {
    scheduleInterview(details: any): Promise<any>;
    getJobSeekerInterviewCounts(userId: string): Promise<any>;
}