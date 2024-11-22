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
}
