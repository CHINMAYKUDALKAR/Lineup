import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { EmailQueueProcessor } from './email.queue';

/**
 * TODO: Email Module
 * 
 * Configure this module with:
 * - imports: Required dependency modules
 * - controllers: HTTP route handlers
 * - providers: Services and dependencies
 * - exports: Services available to other modules
 */
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailQueueProcessor],
  exports: [EmailService],
})
export class EmailModule {}
