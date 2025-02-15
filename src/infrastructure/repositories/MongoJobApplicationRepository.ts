import { JobApplicationRepository } from "../../domain/repositories/JobApplicationRepository";
import JobApplicationModel from "../database/models/JobApplicationModel";

export class MongoJobApplicationRepository implements JobApplicationRepository {
    async getApplicationsByjobId(jobId: string): Promise<any> {
        try {

            const applications = await JobApplicationModel.find({ jobId }).populate(
                'userId',
                'firstName lastName email resume'
            );

            return applications;
        } catch (error) {
            console.error("Error fetching applications by jobId:", error);
            throw new Error("Failed to fetch applications.");
        }
    }
    async changeApplicantStatus(applicantId: string, status: string): Promise<any> {
        try {

            const updateResult = await JobApplicationModel.updateMany(
                { _id: applicantId }, // Filter applications by applicantId
                { $set: { status } } // Update the status field
            );

            const applications = await JobApplicationModel.find({ _id: applicantId }).populate(
                'userId',
                'firstName lastName email resume'
            ).populate(
                'jobId',
                'company'
            );

            console.log("Updated Applications:", applications);

            return applications;
        } catch (error) {
            console.error("Error updating applications by applicantId:", error);
            throw new Error("Failed to update applications.");
        }
    }


    async getApplication(jobId: string, userId: string): Promise<any> {
        try {
            const existingApplication = await JobApplicationModel.findOne({ jobId, userId }).exec();

            if (!existingApplication) {
                console.log("No application found for this jobId and userId.");
                return null;
            }

            return existingApplication;
        } catch (error) {
            console.error("Error fetching application:", error);
            throw new Error("Failed to fetch application.");
        }
    }

    async createApplication(jobId: string, userId: string): Promise<any> {
        try {
            const newApplication = new JobApplicationModel({
                jobId,
                userId,
                status: "Pending"
            });

            const savedApplication = await newApplication.save();

            return savedApplication;
        } catch (error) {
            console.error("Error creating job application:", error);
            throw new Error("Failed to create application.");
        }
    }

    async getAppliedJobs(userId: string): Promise<any> {
        try {
            const applications = await JobApplicationModel.find({ userId })
              .populate<{ jobId: { title: string; company: { name: string; logo: string } } }>(
                'jobId',
                'title company'
              )
              .populate<{ userId: { firstName: string; lastName: string; email: string } }>(
                'userId',
                'firstName lastName email'
              );
        
            if (!applications || applications.length === 0) {
              return [];
            }
        
            return applications.map(application => ({
              id: application.id.toString(),
              title: (application.jobId as any).title || 'Unknown Title',
              company: {
                name: (application.jobId as any).company?.name || 'Unknown Company',
                logo: (application.jobId as any).company?.logo || 'No Logo',
              },
              status: application.status,
              applicationDate: application.dateApplied,
            }));
          } catch (error) {
            console.error("Error fetching applied jobs:", error);
            throw new Error(`Failed to fetch applied jobs for user ${userId}`);
          }
        }
    
    
}
