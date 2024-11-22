import { UserRepository } from '../../../domain/repositories/UserRepository';
import { RecruiterRepository } from '../../../domain/repositories/RecruiterRepository';
import { User, UserProfile } from '../../../domain/entities/User';
import { RecruiterProfile } from '../../../domain/entities/Recruiter';

export class GetAllUsersUseCase {
    constructor(private userRepository: UserRepository,
        private recruiterRepository: RecruiterRepository
    ) {}

    async execute(): Promise<UserProfile[]> {
        return this.userRepository.getAllUsers();
    }

    async getRecruiters(): Promise<RecruiterProfile[]> {
        return this.recruiterRepository.getAllRecruiters();
    }
}
