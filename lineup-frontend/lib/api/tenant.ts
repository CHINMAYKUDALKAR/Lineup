/**
 * Tenant API Types and Contracts
 * 
 * This file defines the API contracts for tenant settings and configuration.
 * Implementation logic should be added separately.
 */

// =============================================================================
// Types - Settings Interfaces
// =============================================================================

export interface BrandingSettings {
  organizationName: string;
  address: string;
  supportEmail: string;
  primaryColor: string;
  accentColor: string;
  logos: {
    main?: File | null;
    favicon?: File | null;
    lightTheme?: File | null;
    darkTheme?: File | null;
  };
}

export interface DomainSettings {
  subdomain: string;
  customDomain: string;
  customDomainVerified: boolean;
  customDomainSSLStatus: "pending" | "verified" | "error";
  webhookCallbackURL: string;
  domainRedirectRules: Array<{
    from: string;
    to: string;
  }>;
}

export interface AuthenticationSettings {
  defaultLoginMethod: "password" | "google" | "microsoft" | "azure" | "saml";
  allowPasswordLogin: boolean;
  forceSSO: boolean;
  ssoConfig: {
    identityProviderName: string;
    loginURL: string;
    logoutURL: string;
    certificateUpload?: File | null;
    entityID: string;
    audienceURI: string;
    acsURL: string;
  };
  ssoConnectionStatus: "connected" | "not_connected";
}

export interface SecuritySettings {
  enable2FA: boolean;
  require2FAForAllUsers: boolean;
  sessionTimeout: "15m" | "30m" | "1h" | "4h" | "24h";
  passwordPolicy: {
    minLength: number;
    requireSymbol: boolean;
    requireUppercase: boolean;
    requireNumber: boolean;
  };
  ipAllowlist: Array<{
    id: string;
    ip: string;
    description: string;
    addedAt: string;
  }>;
  geographicalRestrictions: boolean;
  notifyOnNewLogin: boolean;
  notifyOnFailedSSO: boolean;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  replyToEmail: string;
  configured: boolean;
}

export interface APIKey {
  id: string;
  label: string;
  key: string; // masked like: sk_test_****...****
  scopes: ("read" | "write" | "admin")[];
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  active: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  metadata: Record<string, any>;
  ipAddress: string;
  severity: "info" | "warning" | "error";
}

// =============================================================================
// API Function Stubs
// TODO: Implement these functions with actual HTTP client calls
// =============================================================================

export const tenantApi = {
  // Branding
  // TODO: Implement - GET /settings
  getBrandingSettings: async (): Promise<BrandingSettings> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PATCH /settings/branding
  updateBrandingSettings: async (settings: Partial<BrandingSettings>): Promise<BrandingSettings> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PATCH /settings/branding (reset)
  resetBranding: async (): Promise<BrandingSettings> => {
    throw new Error('Not implemented');
  },

  // Domain
  // TODO: Implement - GET /settings
  getDomainSettings: async (): Promise<DomainSettings> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PATCH /settings/domain
  updateDomainSettings: async (settings: Partial<DomainSettings>): Promise<DomainSettings> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /tenants/:id/domain/verify
  verifyDomain: async (domain: string): Promise<{ verified: boolean; sslStatus: string }> => {
    throw new Error('Not implemented');
  },

  // Authentication
  // TODO: Implement - GET /settings
  getAuthenticationSettings: async (): Promise<AuthenticationSettings> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PATCH /settings/authentication
  updateAuthenticationSettings: async (settings: Partial<AuthenticationSettings>): Promise<AuthenticationSettings> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /sso/test
  testSSO: async (config: AuthenticationSettings["ssoConfig"]): Promise<{ status: string }> => {
    throw new Error('Not implemented');
  },

  // Security
  // TODO: Implement - GET /settings/security
  getSecuritySettings: async (): Promise<SecuritySettings> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PATCH /settings/security
  updateSecuritySettings: async (settings: Partial<SecuritySettings>): Promise<SecuritySettings> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement IP allowlist management
  addIPToAllowlist: async (ip: string, description: string): Promise<{ id: string; ip: string; description: string; addedAt: string }> => {
    throw new Error('Not implemented');
  },

  removeIPFromAllowlist: async (id: string): Promise<{ success: boolean }> => {
    throw new Error('Not implemented');
  },

  // Email
  // TODO: Implement - GET /settings (email section)
  getEmailSettings: async (): Promise<EmailSettings> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PATCH /settings/smtp
  updateEmailSettings: async (settings: Partial<EmailSettings>): Promise<EmailSettings> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /settings/smtp/test
  testEmailSettings: async (toEmail: string): Promise<{ success: boolean; message: string }> => {
    throw new Error('Not implemented');
  },

  // API Keys
  // TODO: Implement - GET /settings/apikeys
  getAPIKeys: async (): Promise<APIKey[]> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /settings/apikeys
  createAPIKey: async (label: string, scopes: ("read" | "write" | "admin")[], expiresIn?: "30d" | "90d" | "1yr" | "never"): Promise<APIKey> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /settings/apikeys/revoke
  revokeAPIKey: async (id: string): Promise<{ success: boolean }> => {
    throw new Error('Not implemented');
  },

  // Audit Logs
  // TODO: Implement - GET /audit
  getAuditLogs: async (filters?: {
    user?: string;
    dateRange?: [string, string];
    eventType?: string;
    severity?: "info" | "warning" | "error";
  }): Promise<AuditLog[]> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /audit/export/csv
  exportAuditLogsCSV: async (): Promise<{ success: boolean; filename?: string }> => {
    throw new Error('Not implemented');
  },
};
