import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * ROLE HIERARCHY
 * Higher level roles include permissions of lower levels.
 * 
 * SUPERADMIN (100) - Platform-wide super user, access to everything
 * SUPPORT (90)     - Platform support staff, read-only cross-tenant
 * ADMIN (80)       - Tenant administrator, full control within tenant
 * MANAGER (60)     - Team manager, can manage team and scheduling
 * RECRUITER (40)   - Recruiter, can manage candidates and interviews
 * INTERVIEWER (20) - Interviewer, can view assigned interviews only
 */
export const ROLE_HIERARCHY: Record<string, number> = {
  SUPERADMIN: 100,
  SUPPORT: 90,
  ADMIN: 80,
  MANAGER: 60,
  RECRUITER: 40,
  INTERVIEWER: 20,
};

/**
 * RbacGuard
 * 
 * PURPOSE: Enforces Role-Based Access Control on protected routes.
 * 
 * AUTH FLOW POSITION: After JwtAuthGuard and TenantOwnershipGuard
 * 
 * FLOW:
 * 1. Read required roles from @Roles() decorator via Reflector
 * 2. If no roles required, allow access
 * 3. Get user from request (set by JwtAuthGuard)
 * 4. SUPERADMIN bypasses all role checks
 * 5. Get user's role for active tenant from user.roles[activeTenantId]
 * 6. Check if user's role level >= required role level (hierarchy check)
 * 
 * MULTI-TENANT ROLE MODEL:
 * - Users can have different roles in different tenants
 * - Token payload includes: roles: { [tenantId]: 'ADMIN', [tenantId2]: 'RECRUITER' }
 * - Active tenant role is determined by: user.roles[req.tenantId]
 * 
 * USAGE:
 * @UseGuards(JwtAuthGuard, RbacGuard)
 * @Roles('ADMIN', 'MANAGER')  // Either role satisfies requirement
 * @Get('admin-route')
 * handler() { ... }
 */
@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    // Step 1: Read required roles from decorator metadata
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Step 2: No roles required = public endpoint (within authenticated context)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user, tenantId } = context.switchToHttp().getRequest();

    // Step 3: Ensure user context exists
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Step 4: SUPERADMIN bypass
    // TODO: Implement SUPERADMIN check
    // if (user.role === 'SUPERADMIN') return true;

    // Step 5: Get role for active tenant
    // TODO: Extract role from user.roles[activeTenantId]
    // const activeTenantId = tenantId || user.activeTenantId;
    // const roleInTenant = user.roles?.[activeTenantId];

    // Step 6: Check role hierarchy
    // TODO: Implement hasRequiredRole() check
    // if (this.hasRequiredRole(roleInTenant, requiredRoles)) {
    //   return true;
    // }

    // TODO: Remove this throw when implemented
    throw new Error('TODO: Implement RbacGuard - role validation');
  }

  /**
   * Check if user's role level meets any of the required roles.
   * Uses role hierarchy for comparison.
   * 
   * @param userRole - User's role in current tenant
   * @param requiredRoles - Array of roles that satisfy the requirement (OR logic)
   * @returns true if user's role level >= lowest required role level
   */
  private hasRequiredRole(userRole: string, requiredRoles: string[]): boolean {
    const userRoleLevel = ROLE_HIERARCHY[userRole] || 0;

    // Check if user's role level is >= any required role level
    for (const requiredRole of requiredRoles) {
      const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
      if (userRoleLevel >= requiredLevel) {
        return true;
      }
    }

    return false;
  }
}
