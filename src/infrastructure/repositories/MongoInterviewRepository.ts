import { InterviewRepository } from '../../domain/repositories/InterviewRepository'
import InterviewModel from '../database/models/InterviewModel'


export class MongoInterviewRepository implements InterviewRepository {

    async scheduleInterview(details: any): Promise<any> {
        try {
            // Create interview document
            const interview = new InterviewModel({
                jobSeekerId: details.jobSeekerId,
                recruiterId: details.recruiterId,
                jobApplicationId: details.jobApplicationId,
                scheduledDate: details.scheduledDate,
                scheduledTime: details.scheduledTime,
                status: "Scheduled",
            });

            // Save interview to DB
            await interview.save();

            return interview;
        } catch (error: any) {
            throw new Error(`Failed to schedule interview: ${error.message}`);
        }
    }

    async  getJobSeekerInterviewCounts(userId: string): Promise<any> {
        
        const counts = await InterviewModel.find({jobSeekerId: userId}).countDocuments()
    }
}
