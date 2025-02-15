import { RecruiterRepository } from '../../../domain/repositories/RecruiterRepository';
import { EmailService } from "../../../infrastructure/services/EmailService";

export class VerifyRecruiterUseCase {
    constructor( private recruiterRepository: RecruiterRepository ,
    private emailService: EmailService
    ) {}

    async execute( recruiterId: string, action: string, reason: string): Promise<Boolean> {

        const recruiter = await this.recruiterRepository.findById(recruiterId)

        if (!recruiter) {
            throw new Error(`Recruiter not found`);
        }

        const updatedProfile = await this.recruiterRepository.updateRecruiterProfile(recruiter.email, {accountStatus: action})

        if( action == 'suspended') {

            await this.emailService.sendRecruiterRejectionEmail(recruiter.email, `${recruiter.firstName} ${recruiter.lastName}`, reason)
        } else if ( action == 'active') {
            await this.emailService.sendRecruiterVerificationEmail(recruiter.email, `${recruiter.firstName} ${recruiter.lastName}`)
        }

        if (!updatedProfile) throw new Error('Failed to update profile');

        return true
    }
}