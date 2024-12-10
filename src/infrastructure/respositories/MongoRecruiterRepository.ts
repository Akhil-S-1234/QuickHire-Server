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
                recruiter.id?.toString() ?? '',  // Convert ID to string
                recruiter.name,
                recruiter.email,  // Email is required, no fallback needed
                recruiter.phone ?? '',  // Fallback for phone
                recruiter.position ?? '',  // Fallback for position
                recruiter.companyName ?? '',  // Fallback for companyName
                recruiter.password ?? '', 
                !!recruiter.isBlocked,            // Convert `Boolean` to `boolean`
                // Fallback for password
                recruiter.createdAt ?? new Date()  // Fallback for createdAt
            )
            : null;
    }

    async findById(recruiterId: string): Promise<Recruiter | null> {
        const recruiter = await RecruiterModel.findById(recruiterId)

        return recruiter
            ? new Recruiter(
                recruiter.id?.toString() ?? '',  // Convert ID to string
                recruiter.name,
                recruiter.email,  // Email is required, no fallback needed
                recruiter.phone ?? '',  // Fallback for phone
                recruiter.position ?? '',  // Fallback for position
                recruiter.companyName ?? '',  // Fallback for companyName
                recruiter.password ?? '', 
                !!recruiter.isBlocked,            // Convert `Boolean` to `boolean`
                recruiter.createdAt ?? new Date()  // Fallback for createdAt
            )
            : null;
    }

    async save(recruiter: Recruiter): Promise<void> {
        const recruiterRecord = new RecruiterModel(recruiter);
        await recruiterRecord.save();
    }

    async findProfileByEmail(email: string): Promise<RecruiterProfile | null> {
        const recruiter = await RecruiterModel.findOne({ email });

        if (!recruiter) return null;

        return new RecruiterProfile(
            recruiter.id?.toString() ?? '',  // Convert ID to string
            recruiter.name,
            recruiter.email,
            recruiter.phone,
            recruiter.position,
            recruiter.companyName ?? '',      // Fallback for companyName
            recruiter.profilePicture,      // Fallback for companyName
            !!recruiter.isBlocked,            // Convert `Boolean` to `boolean`
            recruiter.createdAt,      // Fallback for companyName
            recruiter.updatedAt,
        );
    }

    async getAllRecruiters(): Promise<RecruiterProfile[]> {
        const recruiters = await RecruiterModel.find();

        return recruiters.map(recruiter => new RecruiterProfile(
            recruiter.id?.toString() ?? '',  // Convert ID to string
            recruiter.name,
            recruiter.email,
            recruiter.phone,
            recruiter.position,
            recruiter.companyName ?? '',      // Fallback for companyName
            recruiter.profilePicture,      // Fallback for companyName
            !!recruiter.isBlocked,            // Convert `Boolean` to `boolean`
            recruiter.createdAt,      // Fallback for companyName
            recruiter.updatedAt,      // Fallback for companyName
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
