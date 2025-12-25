import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key for roles decorator.
 * Used by RbacGuard to read required roles from route handlers.
 */
export const ROLES_KEY = 'roles';

/**
 * Available system roles.
 * These are built-in roles with predefined permissions.
 * Custom roles can extend these with additional permissions.
 */
export type SystemRole =
    | 'SUPERADMIN'   // Platform superuser - all access
    | 'SUPPORT'      // Platform support - read-only cross-tenant
    | 'ADMIN'        // Tenant admin - full tenant control
    | 'MANAGER'      // Team manager - team + scheduling
    | 'RECRUITER'    // Recruiter - candidates + interviews
    | 'INTERVIEWER'; // Interviewer - assigned interviews only

/**
 * Roles Decorator
 * 
 * Mark a route as requiring specific roles.
 * Used with RbacGuard to enforce role-based access control.
 * 
 * BEHAVIOR:
 * - Multiple roles = OR logic (user needs at least one)
 * - Role hierarchy is checked (ADMIN satisfies MANAGER requirement)
 * - Must be used with @UseGuards(JwtAuthGuard, RbacGuard)
 * 
 * @example
 * // Require ADMIN or MANAGER role
 * @UseGuards(JwtAuthGuard, RbacGuard)
 * @Roles('ADMIN', 'MANAGER')
 * @Patch('settings')
 * updateSettings() { ... }
 * 
 * @example
 * // Require ADMIN only
 * @UseGuards(JwtAuthGuard, RbacGuard)
 * @Roles('ADMIN')
 * @Delete('users/:id')
 * deleteUser() { ... }
 * 
 * @param roles - One or more roles that satisfy the requirement
 */
export const Roles = (...roles: (SystemRole | string)[]) =>
    SetMetadata(ROLES_KEY, roles);
