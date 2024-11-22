
export interface AdminRepository {

    findByEmail(email : string): Promise< {email: string, password: string} | null>
    
}