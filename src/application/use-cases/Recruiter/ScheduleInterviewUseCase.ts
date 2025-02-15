import { InterviewRepository } from "@domain/repositories/InterviewRepository";
import { RecruiterRepository } from "@domain/repositories/RecruiterRepository";

export class ScheduleInterviewUseCase {

    constructor(
        private recruiterRepository: RecruiterRepository,
        private interviewRepository: InterviewRepository
    ) { }

    async scheduleInterview(interviewDetails: any, email: string): Promise<any> {
        
        const recruiterProfile = await this.recruiterRepository.findByEmail(email);

        const jobSeekerInterviews = await this.interviewRepository.getJobSeekerInterviewCounts(interviewDetails.jobSeekerId)

        if (!recruiterProfile) throw new Error('User not found');

        interviewDetails.recruiterId = recruiterProfile.id

        return await this.interviewRepository.scheduleInterview(interviewDetails)

    }

}