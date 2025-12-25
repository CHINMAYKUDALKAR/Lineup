import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

/**
 * TenantOwnershipGuard
 * 
 * PURPOSE: Ensures valid tenant context exists and prevents cross-tenant access.
 * 
 * AUTH FLOW POSITION: After JwtAuthGuard, before RbacGuard
 * 
 * TENANT CONTEXT SOURCES (priority order):
 * 1. JWT payload: user.activeTenantId (primary source)
 * 2. Request header: X-Tenant-Id (for tenant switching)
 * 3. Request tenantId: Already set by previous middleware
 * 
 * FLOW:
 * 1. Ensure user is authenticated (req.user exists)
 * 2. SUPERADMIN can access any tenant - bypass checks
 * 3. Determine active tenant from token or header
 * 4. Verify user has role in the target tenant (user.roles[tenantId])
 * 5. If X-Tenant-Id header differs from JWT, validate access and switch
 * 6. Set req.tenantId for downstream use
 * 
 * SECURITY:
 * - Prevents users from accessing resources of tenants they don't belong to
 * - Validates tenant membership via user.roles map
 * - X-Tenant-Id header allows switching between user's tenants
 * 
 * CONTEXT SET:
 * - req.tenantId = validated active tenant ID
 * 
 * USAGE:
 * @UseGuards(JwtAuthGuard, TenantOwnershipGuard, RbacGuard)
 * @Get('tenant-resource')
 * handler(@Req() req) { const tenantId = req.tenantId; }
 */
@Injectable()
export class TenantOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const { user, tenantId } = req;

    // Step 1: Ensure user is authenticated
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Step 2: SUPERADMIN can access any tenant
    // TODO: Implement SUPERADMIN bypass
    // if (user.role === 'SUPERADMIN') {
    //   return true;
    // }

    // Step 3: Determine active tenant context
    // TODO: Get activeTenantId from token or request
    // const activeTenantId = tenantId || user.activeTenantId;
    // if (!activeTenantId) {
    //   throw new ForbiddenException('No tenant context - cannot access tenant-scoped resources');
    // }

    // Step 4: Verify user has access to this tenant
    // TODO: Check user.roles[activeTenantId] exists
    // if (user.roles && typeof user.roles === 'object') {
    //   if (!user.roles[activeTenantId]) {
    //     throw new ForbiddenException('You do not have access to this tenant');
    //   }
    // }

    // Step 5: Handle X-Tenant-Id header for tenant switching
    // TODO: Validate header tenant access
    // const headerTenantId = req.headers['x-tenant-id'];
    // if (headerTenantId && headerTenantId !== activeTenantId) {
    //   if (user.roles && user.roles[headerTenantId]) {
    //     req.tenantId = headerTenantId;
    //   } else {
    //     throw new ForbiddenException('Cannot access resources of a different tenant');
    //   }
    // }

    // Step 6: Set tenantId for downstream use
    // TODO: Set req.tenantId = activeTenantId;

    // TODO: Remove this throw when implemented
    throw new Error('TODO: Implement TenantOwnershipGuard - tenant validation');
  }
}
