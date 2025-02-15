import { RecruiterDTO } from '../../application/dtos/Recruiter/RecruiterProfileDto';
import { UpdateRecruiterDto } from '../../application/dtos/Recruiter/UpdateRecruiterProfileDto'
import { Recruiter, RecruiterProfile } from '../entities/Recruiter';

export interface RecruiterRepository {
    findByEmail(email: string): Promise<Recruiter | null>;
    findById(recruiterId: string): Promise<Recruiter | null>;
    getAllRecruiters(status: boolean): Promise<RecruiterProfile[]> 
    save(recruiter: Recruiter): Promise<void>;
    findProfileByEmail(email : string): Promise< RecruiterProfile | null>
    updateRecruiterProfile(email: string, updates: UpdateRecruiterDto): Promise<Recruiter | null>;
}
