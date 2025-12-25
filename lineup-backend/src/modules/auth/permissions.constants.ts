/**
 * Permission Constants
 * 
 * Defines granular permissions for the application.
 * Used with the @RequirePermissions decorator and PermissionGuard.
 * 
 * PERMISSION FORMAT: resource:action
 * Examples: 'candidates:view', 'scheduling:create', 'users:invite'
 * 
 * WILDCARDS:
 * - 'resource:*' - All actions for a resource
 * - '*' - All permissions (SUPERADMIN only)
 */
export const Permissions = {
    // Candidate Management
    CANDIDATES: {
        VIEW: 'candidates:view',
        CREATE: 'candidates:create',
        UPDATE: 'candidates:update',
        DELETE: 'candidates:delete',
        BULK_IMPORT: 'candidates:bulk:import',
        BULK_EXPORT: 'candidates:bulk:export',
    },

    // Interview Scheduling
    SCHEDULING: {
        VIEW: 'scheduling:view',
        CREATE: 'scheduling:create',
        UPDATE: 'scheduling:update',
        DELETE: 'scheduling:delete',
        CANCEL: 'scheduling:cancel',
    },

    // Integrations
    INTEGRATIONS: {
        VIEW: 'integrations:view',
        MANAGE: 'integrations:manage',
        CONNECT: 'integrations:connect',
        DISCONNECT: 'integrations:disconnect',
        VIEW_CREDENTIALS: 'integrations:credentials:view',
        SYNC_TRIGGER: 'integrations:sync:trigger',
    },

    // Reports & Analytics
    REPORTS: {
        VIEW: 'reports:view',
        CREATE: 'reports:create',
        EXPORT: 'reports:export',
    },

    // User Management
    USERS: {
        VIEW: 'users:view',
        CREATE: 'users:create',
        UPDATE: 'users:update',
        DEACTIVATE: 'users:deactivate',
        INVITE: 'users:invite',
        CHANGE_ROLE: 'users:role:change',
    },

    // Team Management
    TEAMS: {
        VIEW: 'teams:view',
        CREATE: 'teams:create',
        UPDATE: 'teams:update',
        DELETE: 'teams:delete',
        MANAGE_MEMBERS: 'teams:members:manage',
    },

    // Settings
    SETTINGS: {
        VIEW: 'settings:view',
        UPDATE: 'settings:update',
        SECURITY: 'settings:security',
        BRANDING: 'settings:branding',
    },

    // Audit
    AUDIT: {
        VIEW: 'audit:view',
        EXPORT: 'audit:export',
    },

    // Bulk Operations
    BULK: {
        OPERATIONS: 'bulk:operations',
    },
} as const;

/**
 * Role to Permission Mapping
 * 
 * Defines which permissions each system role has.
 * '*' means all permissions (superuser).
 * 'resource:*' means all actions for that resource.
 */
export const RolePermissions: Record<string, string[]> = {
    // Platform superuser - all permissions
    SUPERADMIN: ['*'],

    // Support staff - read-only access
    SUPPORT: [
        'candidates:view',
        'scheduling:view',
        'integrations:view',
        'reports:view',
        'users:view',
        'teams:view',
        'audit:view',
    ],

    // Tenant admin - full tenant control
    ADMIN: [
        'candidates:*',
        'scheduling:*',
        'integrations:*',
        'reports:*',
        'users:*',
        'teams:*',
        'settings:*',
        'audit:*',
        'bulk:*',
    ],

    // Manager - team and scheduling control
    MANAGER: [
        'candidates:view',
        'candidates:create',
        'candidates:update',
        'candidates:bulk:import',
        'candidates:bulk:export',
        'scheduling:view',
        'scheduling:create',
        'scheduling:update',
        'scheduling:cancel',
        'integrations:view',
        'integrations:sync:trigger',
        'reports:view',
        'reports:export',
        'users:view',
        'users:invite',
        'teams:view',
        'teams:create',
        'teams:update',
        'teams:members:manage',
    ],

    // Recruiter - candidates and interviews
    RECRUITER: [
        'candidates:view',
        'candidates:create',
        'candidates:update',
        'scheduling:view',
        'scheduling:create',
        'scheduling:update',
        'reports:view',
        'teams:view',
    ],

    // Interviewer - view assigned only
    INTERVIEWER: [
        'candidates:view', // Limited to assigned candidates
        'scheduling:view', // Limited to their interviews
    ],
};

/**
 * Check if a role has a specific permission.
 * 
 * @param role - System role name
 * @param permission - Permission to check (e.g., 'candidates:view')
 * @returns true if role has the permission
 */
export function hasPermission(role: string, permission: string): boolean {
    const rolePerms = RolePermissions[role];

    if (!rolePerms) {
        return false;
    }

    // TODO: Implement actual permission check
    // 1. Check for '*' (superuser)
    // 2. Check for exact match
    // 3. Check for wildcard match (e.g., 'candidates:*')
    throw new Error('TODO: Implement hasPermission');
}

/**
 * Get all permissions for a role.
 * Expands wildcards to actual permission strings.
 * 
 * @param role - System role name
 * @returns Array of expanded permission strings
 */
export function getRolePermissions(role: string): string[] {
    const rolePerms = RolePermissions[role];

    if (!rolePerms) {
        return [];
    }

    // TODO: Implement permission expansion
    // 1. If '*', return all permissions
    // 2. Expand 'resource:*' to all actions
    // 3. Return unique list
    throw new Error('TODO: Implement getRolePermissions');
}
