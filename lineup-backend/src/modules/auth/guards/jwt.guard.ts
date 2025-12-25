import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

/**
 * JwtAuthGuard
 * 
 * PURPOSE: Validates JWT access tokens and populates request context with user data.
 * 
 * AUTH FLOW POSITION: First in the guard chain
 * 
 * FLOW:
 * 1. Extract Authorization header from request
 * 2. Parse Bearer token
 * 3. Verify token signature and expiration (TODO)
 * 4. Decode token payload containing: { sub, email, activeTenantId, roles, iat, exp }
 * 5. Set req.user with decoded payload
 * 6. Set req.tenantId from payload.activeTenantId for backward compatibility
 * 
 * CONTEXT POPULATED:
 * - req.user = { sub, email, activeTenantId, roles: { [tenantId]: role }, ... }
 * - req.tenantId = user's active tenant ID
 * 
 * USAGE:
 * @UseGuards(JwtAuthGuard)
 * @Get('protected-route')
 * handler(@Req() req) { const user = req.user; }
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    // Step 1: Check for Authorization header
    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    // Step 2: Extract token from "Bearer <token>" format
    const token = authHeader.replace('Bearer ', '').trim();

    // Step 3-4: Verify and decode token
    // TODO: Implement actual token verification using verifyAccessToken()
    // const payload = verifyAccessToken(token);
    const payload = null; // TODO: Replace with actual verification

    if (!payload) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    // Step 5-6: Populate request context
    // TODO: Uncomment when token verification is implemented
    // if (payload && typeof payload === 'object' && 'activeTenantId' in payload) {
    //   (payload as any).tenantId = payload.activeTenantId;
    //   req.tenantId = payload.activeTenantId;
    // }
    // req.user = payload;

    // TODO: Remove this throw when implemented
    throw new Error('TODO: Implement JwtAuthGuard - token verification');
  }
}
