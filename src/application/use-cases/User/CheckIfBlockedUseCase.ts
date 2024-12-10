// src/application/usecases/user/checkifblocked.ts

import { User } from '../../../domain/entities/User'
import { UserRepository } from '../../../domain/repositories/UserRepository'

export class CheckIfBlockedUseCase{
    constructor(private userRepository: UserRepository) {}

  async checkIfBlocked(email: string): Promise<Boolean> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('User not found');
    return user.isBlocked ?? false;
  }
}
