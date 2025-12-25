import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Metadata key for permissions decorator
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator to specify required permissions for an endpoint.
 * Multiple permissions require ALL to be satisfied (AND logic).
 * 
 * @example
 * @RequirePermissions('candidates:create', 'candidates:update')
 * @Post('candidates')
 * createCandidate() { ... }
 */
export const RequirePermissions = (...permissions: string[]) =>
  Reflect.metadata(PERMISSIONS_KEY, permissions);

/**
 * PermissionGuard
 * 
 * PURPOSE: Enforces fine-grained permission-based access control.
 * 
 * AUTH FLOW POSITION: Last in guard chain (after Jwt, TenantOwnership, Rbac)
 * 
 * PERMISSION SOURCES:
 * 1. System role permissions (from DEFAULT_ROLE_PERMISSIONS)
 * 2. Custom role permissions (from UserCustomRole assignments)
 * 
 * FLOW:
 * 1. Read required permissions from @RequirePermissions() decorator
 * 2. If no permissions required, allow access
 * 3. SUPERADMIN has all permissions - bypass
 * 4. Get system role permissions for user's role
 * 5. Query custom role permissions from database
 * 6. Merge all permissions and check if ALL required are present
 * 
 * PERMISSION FORMAT:
 * - Resource:action pattern, e.g., 'candidates:create', 'scheduling:view'
 * - Wildcards supported: 'candidates:*' matches all candidate actions
 * - '*' means all permissions (SUPERADMIN only)
 * 
 * USAGE:
 * @UseGuards(JwtAuthGuard, TenantOwnershipGuard, PermissionGuard)
 * @RequirePermissions('candidates:create')
 * @Post('candidates')
 * create() { ... }
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    // TODO: Add PrismaService for custom role queries
    // private prisma: PrismaService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Step 1: Read required permissions from decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    // Step 2: No permissions required = allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user, tenantId } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    // Step 3: SUPERADMIN has all permissions
    // TODO: Implement SUPERADMIN bypass
    // if (user.role === 'SUPERADMIN') {
    //   return true;
    // }

    // Step 4: Get system role permissions
    // TODO: Import and use DEFAULT_ROLE_PERMISSIONS
    // const systemRolePermissions = DEFAULT_ROLE_PERMISSIONS[user.role] || [];

    // Step 5: Get custom role permissions from database
    // TODO: Query UserCustomRole table
    // const customRolePermissions = await this.getCustomRolePermissions(
    //   user.sub,
    //   tenantId || user.tenantId
    // );

    // Step 6: Merge and check all required permissions
    // TODO: Combine permissions and verify
    // const allPermissions = new Set([
    //   ...systemRolePermissions,
    //   ...customRolePermissions,
    // ]);
    // return requiredPermissions.every(perm => allPermissions.has(perm));

    // TODO: Remove this throw when implemented
    throw new Error('TODO: Implement PermissionGuard - permission validation');
  }

  /**
   * Get permissions from custom roles assigned to user in tenant.
   * 
   * @param userId - User ID from JWT
   * @param tenantId - Active tenant ID
   * @returns Array of permission strings
   */
  private async getCustomRolePermissions(
    userId: string,
    tenantId: string
  ): Promise<string[]> {
    if (!userId || !tenantId) {
      return [];
    }

    // TODO: Query database for custom role assignments
    // const assignments = await this.prisma.userCustomRole.findMany({
    //   where: { userId, tenantId },
    //   include: { role: true },
    // });
    // 
    // const permissions: string[] = [];
    // for (const assignment of assignments) {
    //   permissions.push(...assignment.role.permissions);
    // }
    // return permissions;

    return [];
  }
}

/**
 * Utility function to check if user has a specific permission.
 * Can be used in services for programmatic permission checks.
 * 
 * @param userId - User ID
 * @param tenantId - Tenant ID
 * @param userRole - User's system role
 * @param permission - Permission to check
 * @returns true if user has the permission
 */
export async function hasPermission(
  // prisma: PrismaService,
  userId: string,
  tenantId: string,
  userRole: string,
  permission: string
): Promise<boolean> {
  // TODO: Implement permission check
  // 1. Check if SUPERADMIN
  // 2. Check system role permissions
  // 3. Check custom role permissions
  throw new Error('TODO: Implement hasPermission utility');
}

/**
 * Get all permissions for a user (system + custom roles).
 * 
 * @param userId - User ID
 * @param tenantId - Tenant ID
 * @param userRole - User's system role
 * @returns Array of all permission strings
 */
export async function getUserPermissions(
  // prisma: PrismaService,
  userId: string,
  tenantId: string,
  userRole: string
): Promise<string[]> {
  // TODO: Implement get user permissions
  // 1. Get system role permissions (or all if SUPERADMIN)
  // 2. Get custom role permissions
  // 3. Return merged unique set
  throw new Error('TODO: Implement getUserPermissions utility');
}
