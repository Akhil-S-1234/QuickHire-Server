import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config();


export class EmailService {
  private transporter;

  constructor() {

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOtpEmail(recipientEmail: string, otp: string): Promise<void> {

    console.log('Preparing to send OTP to:', recipientEmail, 'with OTP:', otp);

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'Verify Your Email Address',
        text: `Your OTP code is: ${otp}`,
      };

      await this.transporter.sendMail(mailOptions);

      console.log('Success: OTP email sent');
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error('Error sending OTP email: ' + error);
    }
  }

  async sendRecruiterRejectionEmail(recipientEmail: string, recruiterName: string, reason: string): Promise<void> {
    console.log('Preparing to send recruiter rejection email to:', recipientEmail);

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'Recruiter Application Rejected',
        text: `Dear ${recruiterName},\n\nWe regret to inform you that your application as a recruiter has been rejected after review.\n\nReason for Rejection: ${reason}\n\nThank you for your interest.\n\nBest regards,\nQuickHire Team`,
      };

      await this.transporter.sendMail(mailOptions);

      console.log('Success: Recruiter rejection email sent');
    } catch (error) {
      console.error('Error sending recruiter rejection email:', error);
      throw new Error('Error sending recruiter rejection email: ' + error);
    }
  }

  async sendRecruiterVerificationEmail(recipientEmail: string, recruiterName: string): Promise<void> {
    console.log('Preparing to send recruiter verification email to:', recipientEmail);

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'Recruiter Application Verified',
        text: `Dear ${recruiterName},\n\nCongratulations! Your application as a recruiter has been verified and approved by the admin.\n\nYou can now access recruiter features on QuickHire.\n\nBest regards,\nQuickHire Team`,
      };

      await this.transporter.sendMail(mailOptions);

      console.log('Success: Recruiter verification email sent');
    } catch (error) {
      console.error('Error sending recruiter verification email:', error);
      throw new Error('Error sending recruiter verification email: ' + error);
    }
  }

  async sendResetEmail(recipientEmail: string, resetLink: string): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'Password Reset Request',
        text: `Dear User,
  
  You have requested to reset your password. Please click the link below to reset your password:
  
  ${resetLink}
  
  If you did not make this request, please ignore this email or contact support if you have any concerns.
  
  Best regards,
  QuickHire Team`,
      };

      await this.transporter.sendMail(mailOptions);

      console.log('Success: Password reset email sent');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Error sending password reset email: ' + error);
    }
  }

}
