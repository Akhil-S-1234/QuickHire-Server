import { UserRepository } from '../../../domain/repositories/UserRepository';
import { UserProfile } from '../../../domain/entities/User'
import { UpdateUserDTO } from '../../dtos/User/UpdateUserProfileDto'

export class UserProfileUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute(email: string): Promise<UserProfile> {
        const userProfile = await this.userRepository.findProfileByEmail(email);

        if (!userProfile) throw new Error('User not found');

        return userProfile;
    }


    async update(email: string, updates: UpdateUserDTO): Promise<UserProfile> {

        const userProfile = await this.userRepository.findProfileByEmail(email);

        if (!userProfile) throw new Error('User not found');

        // Call the repository's update method to apply the changes
        const updatedProfile = await this.userRepository.updateUserProfile(email, updates);

        if (!updatedProfile) throw new Error('Failed to update profile');

        return updatedProfile;
    }

    async addSkill(email: string, skill: string): Promise<UserProfile> {

        const userProfile = await this.userRepository.findProfileByEmail(email);

        if (!userProfile) throw new Error('User not found');

        if (!userProfile.skills) {
            userProfile.skills = [];
        }

        userProfile.skills.push(skill);

        // Save the updated profile
        const updatedProfile = await this.userRepository.updateUserProfile(email, { skills: userProfile.skills });

        if (!updatedProfile) throw new Error('Failed to update profile');

        return updatedProfile;
    }

    async removeSkill(email: string, skill: string): Promise<UserProfile | null> {
        // Fetch the user profile
        const userProfile = await this.userRepository.findProfileByEmail(email);

        if (!userProfile) throw new Error('User not found');

        if (!userProfile.skills) {
            userProfile.skills = [];
        }

        const updatedSkills = userProfile.skills.filter(existingSkill => existingSkill !== skill);

        const updatedProfile = await this.userRepository.updateUserProfile(email, { skills: updatedSkills });

        return updatedProfile;
    }


    async addEducation(email: string, education: any): Promise<UserProfile> {

        const userProfile = await this.userRepository.findProfileByEmail(email);

        if (!userProfile) throw new Error('User not found');

        if (!userProfile.education) {
            userProfile.education = [];
        }

        userProfile.education.push(education);

        // Save the updated profile
        const updatedProfile = await this.userRepository.updateUserProfile(email, { education: userProfile.education });

        if (!updatedProfile) throw new Error('Failed to update profile');

        return updatedProfile;
    }

    async removeEducation(email: string, educationId: string): Promise<UserProfile> {

        const userProfile = await this.userRepository.findProfileByEmail(email)

        if (!userProfile) throw new Error('User not found')

        if (!userProfile.education || !Array.isArray(userProfile.education)) {
            throw new Error('No education records found for this user');
        }

        console.log('userProfile',userProfile)

        const updatedEducation = userProfile.education.filter(
            (edu) => edu.id !== educationId
        );

        if (updatedEducation.length === userProfile.education.length) {
            throw new Error('Education record not found');
        }

        const updatedProfile = await this.userRepository.updateUserProfile(email, { education: updatedEducation });

        if (!updatedProfile) throw new Error('Failed to update profile')

        return updatedProfile
    }

    async addExperience(email: string, experience: any): Promise<UserProfile> {

        const userProfile = await this.userRepository.findProfileByEmail(email);

        if (!userProfile) throw new Error('User not found');

        if (!userProfile.experience) {
            userProfile.experience = [];
        }

        userProfile.experience.push(experience);

        // Save the updated profile
        const updatedProfile = await this.userRepository.updateUserProfile(email, { experience: userProfile.experience });

        if (!updatedProfile) throw new Error('Failed to update profile');

        return updatedProfile;
    }

    async removeExperience(email: string, experienceId: string): Promise<UserProfile> {

        const userProfile = await this.userRepository.findProfileByEmail(email)

        if (!userProfile) throw new Error('User not found')

        if (!userProfile.experience || !Array.isArray(userProfile.experience)) {
            throw new Error('No experience records found for this user');
        }

        console.log('userProfile',userProfile)

        const updatedExperience = userProfile.experience.filter(
            (edu) => edu.id !== experienceId
        );

        if (updatedExperience.length === userProfile.experience.length) {
            throw new Error('Experience record not found');
        }

        const updatedProfile = await this.userRepository.updateUserProfile(email, { experience: updatedExperience });

        if (!updatedProfile) throw new Error('Failed to update profile')

        return updatedProfile
    }


}
