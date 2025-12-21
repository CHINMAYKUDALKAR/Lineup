import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * TODO: Bootstrap Application
 * 
 * Entry point for the NestJS application.
 * Currently starts a minimal server.
 * 
 * Full implementation should add:
 * - CORS configuration
 * - ValidationPipe (global)
 * - Swagger documentation
 * - Cookie parser
 * - Request body limits
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // TODO: Enable CORS
  app.enableCors();

  // TODO: Add global prefix
  // app.setGlobalPrefix('api/v1');

  // TODO: Add Swagger documentation
  // TODO: Add global pipes and filters

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`\n🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API Docs: http://localhost:${port}/api/docs`);
  console.log('\n⚠️  This is a TODO skeleton - all endpoints return errors\n');
}

bootstrap();
