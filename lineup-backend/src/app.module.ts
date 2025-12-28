import { Module } from '@nestjs/common';
import { AppCommonModule } from './common/app-common.module';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { InterviewsModule } from './modules/interviews/interviews.module';
import { UsersModule } from './modules/users/users.module';

/**
 * App Module
 * 
 * Root application module.
 * 
 * Full implementation should import:
 * - ConfigModule (for environment variables)
 * - AuthModule
 * - CalendarModule
 * - CommunicationModule
 * - IntegrationsModule
 * - etc.
 */
@Module({
  imports: [
    AppCommonModule,
    CandidatesModule,
    InterviewsModule,
    UsersModule,
    // TODO: Import ConfigModule
    // TODO: Import remaining feature modules
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
