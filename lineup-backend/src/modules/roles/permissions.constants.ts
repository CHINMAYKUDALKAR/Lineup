/**
 * Default Role Permissions
 * 
 * Defines the default permissions for each system role.
 * Used by PermissionGuard for system role permission checks.
 * Custom roles can extend these with additional permissions.
 * 
 * This is the roles module version - maintains parity with
 * auth/permissions.constants.ts for custom role management.
 */

/**
 * All available permissions in the system.
 * Used for permission seeding and validation.
 */
export const ALL_PERMISSIONS = [
    // Candidates
    'candidates.view',
    'candidates.create',
    'candidates.update',
    'candidates.delete',
    'candidates.bulkImport',
    'candidates.bulkExport',

    // Scheduling
    'scheduling.view',
    'scheduling.create',
    'scheduling.update',
    'scheduling.delete',
    'scheduling.cancel',

    // Integrations
    'integrations.view',
    'integrations.manage',
    'integrations.connect',
    'integrations.disconnect',
    'integrations.viewCredentials',
    'integrations.syncTrigger',

    // Reports
    'reports.view',
    'reports.create',
    'reports.export',

    // Users
    'users.view',
    'users.create',
    'users.update',
    'users.deactivate',
    'users.invite',
    'users.changeRole',

    // Teams
    'teams.view',
    'teams.create',
    'teams.update',
    'teams.delete',
    'teams.manageMembers',

    // Settings
    'settings.view',
    'settings.update',
    'settings.security',
    'settings.branding',

    // Audit
    'audit.view',
    'audit.export',

    // Bulk
    'bulk.operations',
] as const;

/**
 * Default permissions for each system role.
 * SUPERADMIN has all permissions via '*'.
 * Other roles have explicit permission lists.
 * 
 * Used by:
 * - PermissionGuard for checking system role permissions
 * - RolesService for role management and validation
 * - Custom role creation as base templates
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
    // All permissions
    SUPERADMIN: ['*'],

    // Read-only support access
    SUPPORT: [
        'candidates.view',
        'scheduling.view',
        'integrations.view',
        'reports.view',
        'users.view',
        'teams.view',
        'audit.view',
    ],

    // Full tenant control
    ADMIN: [
        'candidates.view',
        'candidates.create',
        'candidates.update',
        'candidates.delete',
        'candidates.bulkImport',
        'candidates.bulkExport',
        'scheduling.view',
        'scheduling.create',
        'scheduling.update',
        'scheduling.delete',
        'scheduling.cancel',
        'integrations.view',
        'integrations.manage',
        'integrations.connect',
        'integrations.disconnect',
        'integrations.viewCredentials',
        'integrations.syncTrigger',
        'reports.view',
        'reports.create',
        'reports.export',
        'users.view',
        'users.create',
        'users.update',
        'users.deactivate',
        'users.invite',
        'users.changeRole',
        'teams.view',
        'teams.create',
        'teams.update',
        'teams.delete',
        'teams.manageMembers',
        'settings.view',
        'settings.update',
        'settings.security',
        'settings.branding',
        'audit.view',
        'audit.export',
        'bulk.operations',
    ],

    // Team management
    MANAGER: [
        'candidates.view',
        'candidates.create',
        'candidates.update',
        'candidates.bulkImport',
        'candidates.bulkExport',
        'scheduling.view',
        'scheduling.create',
        'scheduling.update',
        'scheduling.cancel',
        'integrations.view',
        'integrations.syncTrigger',
        'reports.view',
        'reports.export',
        'users.view',
        'users.invite',
        'teams.view',
        'teams.create',
        'teams.update',
        'teams.manageMembers',
    ],

    // Recruiting operations
    RECRUITER: [
        'candidates.view',
        'candidates.create',
        'candidates.update',
        'scheduling.view',
        'scheduling.create',
        'scheduling.update',
        'reports.view',
        'teams.view',
    ],

    // Interview access only
    INTERVIEWER: [
        'candidates.view', // Limited to assigned
        'scheduling.view', // Limited to assigned
    ],
};
