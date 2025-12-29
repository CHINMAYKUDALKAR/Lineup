import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import bull from 'bull';
import * as nodemailer from 'nodemailer';

/**
 * TODO: EmailService
 * 
 * Implement the following methods:
 * - enqueue: Implement enqueue logic
 * - sendMail: Implement sendMail logic
 * - smtpFromSettings: Implement smtpFromSettings logic
 * - globalSmtp: Implement globalSmtp logic
 * - sendOnboardingEmail: Implement sendOnboardingEmail logic
 * - previewTemplate: Implement previewTemplate logic
 */
@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('email') private readonly emailQueue: bull.Queue,
  ) {}

  /**
   * TODO: Implement enqueue logic
   */
  async enqueue(data: {
    to: string;
    subject: string;
    html: string;
  }) {
    await this.emailQueue.add('send', data);
    return { queued: true };
  }

  /**
   * TODO: Implement sendMail logic
   */
  async sendMail(to: string, subject: string, html: string) {
    const transporter = this.globalSmtp();

    await transporter.sendMail({
      from: `"No Reply" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,

  });
  return { sent: true };
  }

  /**
   * TODO: Implement smtpFromSettings logic
   */
  async smtpFromSettings() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

  }

  /**
   * TODO: Implement globalSmtp logic
   */
  async globalSmtp() {
    return this.smtpFromSettings();
    
  }

  /**
   * TODO: Implement sendOnboardingEmail logic
   */
  async sendOnboardingEmail(email: string, name: string) {
    const html = 

    return this.enqueue({
      to: email,
      subject: 'Welcome to the platform',
      html,
    });

  }

  /**
   * TODO: Implement previewTemplate logic
   */
  async previewTemplate(name: string) {
    return {
      html: 
    };
 
  }

}



