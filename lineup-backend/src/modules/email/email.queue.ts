import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from './email.service';

@Processor('email')
export class EmailQueueProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process('send')
  async handleSend(job: Job) {
    const { to, subject, html } = job.data;
    await this.emailService.sendMail(to, subject, html);
  }
}

