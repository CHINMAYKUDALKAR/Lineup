import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

/**
 * TODO: ApiKeyGuard
 * 
 * Implement canActivate to protect routes.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // TODO: Implement guard logic
    // - Extract request from context
    // - Validate authorization
    // - Return true to allow, false to deny
    throw new Error('TODO: Implement ApiKeyGuard');
  }
}
