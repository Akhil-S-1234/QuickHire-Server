import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class AuthService {
  constructor(private saltRounds: number = 10) {
    // Ensure JWT secrets are defined
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET environment variables are not defined');
    }
  }

  // Hash and compare password methods
  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error: any) {
      throw new Error('Error hashing password: ' + error.message);
    }
  }

  async comparePassword(password: string , hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error: any) {
      throw new Error('Error comparing passwords: ' + error.message);
    }
  }

  // Generate Access Token
  async generateAccessToken(payload: object): Promise<string> {
    try {
      const secret = process.env.JWT_ACCESS_SECRET;
      if (!secret) throw new Error('JWT_ACCESS_SECRET is not defined');
      return jwt.sign(payload, secret, { expiresIn: '15m' }); // Short expiration time
    } catch (error: any) {
      throw new Error('Error generating access token: ' + error.message);
    }
  }

  // Generate Refresh Token
  async generateRefreshToken(payload: object): Promise<string> {
    try {
      const secret = process.env.JWT_REFRESH_SECRET;
      if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');
      return jwt.sign(payload, secret, { expiresIn: '7d' }); // Longer expiration time
    } catch (error: any) {
      throw new Error('Error generating refresh token: ' + error.message);
    }
  }

  // Verify Access Token
  async verifyAccessToken(token: string): Promise<any> {
    try {
      const secret = process.env.JWT_ACCESS_SECRET;
      if (!secret) throw new Error('JWT_ACCESS_SECRET is not defined');
      return jwt.verify(token, secret);
    } catch (error: any) {
      throw new Error('Invalid or expired access token: ' + error.message);
    }
  }

  async verifyRefreshToken(token: string): Promise<any> {
    try {
        const secret = process.env.JWT_REFRESH_SECRET;
        if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');
        
        // Verify the token using jwt.verify
        const decoded = jwt.verify(token, secret);

        return decoded;
    } catch (error: any) {
        console.log(error);
        throw new Error('Invalid or expired refresh token: ' + error.message);
    }
}


  // Refresh Access Token using Refresh Token
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {

      console.log('we12')

      // Verify refresh token
      const decoded = await this.verifyRefreshToken(refreshToken);

      // Extract necessary data from decoded payload
      const { email } = decoded;

      // Generate a new access token
      return await this.generateAccessToken({ email });
    } catch (error: any) {
      throw new Error('Could not refresh access token: ' + error.message);
    }
  }
}
