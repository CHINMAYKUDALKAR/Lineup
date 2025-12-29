import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';

/**
 * TODO: EmailController
 * 
 * Route: api/v1/email
 * 
 * Implement REST endpoints for this resource.
 * See method TODOs for specific endpoints.
 */
@Controller('api/v1/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('onboarding')
  async sendOnboardingEmail(
    @Body() body: { email: string; name: string },
  ) {
    return this.emailService.sendOnboardingEmail(
      body.email,
      body.name,
    );
  }


  @Post('preview')
  async previewTemplate(
    @Body() body: { name: string },
  ) {
    return this.emailService.previewTemplate(body.name);
  }

  
  // TODO: Inject required services in constructor
  
  // TODO: Implement GET endpoints
  // TODO: Implement POST endpoints
  // TODO: Implement PUT/PATCH endpoints
  // TODO: Implement DELETE endpoints
}
