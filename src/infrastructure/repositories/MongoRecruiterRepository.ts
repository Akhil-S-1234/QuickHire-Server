import { RecruiterRepository } from '../../domain/repositories/RecruiterRepository';
import { Recruiter, RecruiterProfile } from '../../domain/entities/Recruiter';
import { RecruiterDTO } from '../../application/dtos/Recruiter/RecruiterProfileDto';
import { UpdateRecruiterDto } from '../../application/dtos/Recruiter/UpdateRecruiterProfileDto';

import RecruiterModel from '../database/models/RecruiterModel';

export class MongoRecruiterRepository implements RecruiterRepository {

    async findByEmail(email: string): Promise<Recruiter | null> {
        const recruiter = await RecruiterModel.findOne({ email });

        return recruiter
            ? new Recruiter(
                recruiter._id.toString(),  // Convert ID to string
                recruiter.firstName,
                recruiter.lastName,
                recruiter.email,
                recruiter.mobile,
                recruiter.currentLocation,
                recruiter.profilePicture,
                recruiter.professionalDetails,
                recruiter.accountStatus,
                recruiter.isBlocked,
                recruiter.createdAt,
                recruiter.updatedAt,
                recruiter.password,
            )
            : null;
    }

    async findById(recruiterId: string): Promise<Recruiter | null> {
        const recruiter = await RecruiterModel.findById(recruiterId);

        return recruiter
            ? new Recruiter(
                recruiter._id.toString(),  // Convert ID to string
                recruiter.firstName,
                recruiter.lastName,
                recruiter.email,
                recruiter.mobile,
                recruiter.currentLocation,
                recruiter.profilePicture,
                recruiter.professionalDetails,
                recruiter.accountStatus,
                recruiter.isBlocked,
                recruiter.createdAt,
                recruiter.updatedAt,
                recruiter.password,
            )
            : null;
    }

    async save(recruiter: Recruiter): Promise<void> {

        console.log(recruiter)
        const recruiterRecord = new RecruiterModel({
            firstName: recruiter.firstName,
            lastName: recruiter.lastName,
            email: recruiter.email,
            password: recruiter.password,
            mobile: recruiter.mobile,
            currentLocation: recruiter.currentLocation,
            profilePicture: recruiter.profilePicture,
            professionalDetails: recruiter.professionalDetails,
            accountStatus: recruiter.accountStatus,
            isBlocked: recruiter.isBlocked,
        });
        await recruiterRecord.save();
    }

    async findProfileByEmail(email: string): Promise<RecruiterProfile | null> {
        const recruiter = await RecruiterModel.findOne({ email });

        if (!recruiter) return null;

        return new RecruiterProfile(
            recruiter._id.toString(),  // Convert ID to string
            recruiter.firstName,
            recruiter.lastName,
            recruiter.email,
            recruiter.mobile,
            recruiter.currentLocation,
            recruiter.profilePicture,
            recruiter.professionalDetails,
            recruiter.accountStatus,
            recruiter.isBlocked,
            recruiter.createdAt,
            recruiter.updatedAt,
        );
    }

    async getAllRecruiters(status: boolean): Promise<RecruiterProfile[]> {
        const query = status 
    ? { accountStatus: "active" } 
    : { accountStatus: { $ne: "active" } }; 
        const recruiters = await RecruiterModel.find(query);

        return recruiters.map(recruiter => new RecruiterProfile(
            recruiter._id.toString(),  // Convert ID to string
            recruiter.firstName,
            recruiter.lastName,
            recruiter.email,
            recruiter.mobile,
            recruiter.currentLocation,
            recruiter.profilePicture,
            recruiter.professionalDetails,
            recruiter.accountStatus,
            recruiter.isBlocked,
            recruiter.createdAt,
            recruiter.updatedAt,
        ));
    }

    async updateRecruiterProfile(email: string, updates: UpdateRecruiterDto): Promise<Recruiter | null> {
        const result = await RecruiterModel.updateOne(
            { email },  // Filter by email
            { $set: updates }  // Apply partial updates
        );

        if (result.modifiedCount === 0) {
            return null;
        }

        return await RecruiterModel.findOne({ email });
    }
}
