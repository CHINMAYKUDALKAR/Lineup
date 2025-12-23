/**
 * Integrations API Types and Contracts
 * 
 * This file defines the API contracts for integration module endpoints.
 * Implementation logic should be added separately.
 */

// =============================================================================
// Types - Core Integration Types
// =============================================================================

export type SyncDirection = 'inbound' | 'outbound' | 'bidirectional';
export type ConflictResolution = 'local_wins' | 'remote_wins' | 'manual' | 'latest_wins';
export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'syncing';
export type AuthType = 'oauth2' | 'api_key';

export interface Integration {
  id: string;
  tenantId: string;
  provider: string;
  status: IntegrationStatus;
  connectedAt: string | null;
  lastSyncAt: string | null;
  config: IntegrationConfig;
  credentials?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationConfig {
  syncDirection: SyncDirection;
  syncCadence: string;
  conflictResolution: ConflictResolution;
  enableWebhooks: boolean;
  mappings?: FieldMapping[];
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transform?: string;
}

export interface IntegrationField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  description?: string;
}

export interface WebhookEvent {
  id: string;
  provider: string;
  eventType: string;
  payload: Record<string, any>;
  status: 'processed' | 'pending' | 'failed';
  processedAt: string | null;
  createdAt: string;
}

export interface IntegrationMetrics {
  totalSynced: number;
  lastSyncDuration: number;
  errorCount: number;
  successRate: number;
  lastError?: string;
}

export interface AvailableProvider {
  id: string;
  name: string;
  description: string;
  category: 'crm' | 'calendar' | 'ats' | 'hcm';
  authType: AuthType;
  icon: string;
  color: string;
}

// =============================================================================
// Response Types
// =============================================================================

export interface IntegrationListResponse {
  integrations: Integration[];
}

export interface IntegrationResponse {
  integration: Integration;
}

export interface ConnectResponse {
  authUrl: string;
  provider: string;
}

export interface DisconnectResponse {
  success: boolean;
  message: string;
}

export interface SyncResponse {
  success: boolean;
  message: string;
  jobId?: string;
}

export interface FieldSchemasResponse {
  sourceFields: IntegrationField[];
  targetFields: IntegrationField[];
  mappings: FieldMapping[];
}

// =============================================================================
// Request DTOs
// =============================================================================

export interface MappingUpdatePayload {
  provider: string;
  mappings: Array<{
    sourceField: string;
    targetField: string;
    transform?: string;
  }>;
  direction: SyncDirection;
}

export interface ConfigUpdatePayload {
  syncDirection?: SyncDirection;
  syncCadence?: string;
  conflictResolution?: ConflictResolution;
  enableWebhooks?: boolean;
}

// =============================================================================
// Static Data - Available Providers
// =============================================================================

export const AVAILABLE_PROVIDERS: AvailableProvider[] = [
  {
    id: 'zoho',
    name: 'Zoho CRM',
    description: 'Sync contacts and leads with Zoho CRM',
    category: 'crm',
    authType: 'oauth2',
    icon: 'ZH',
    color: 'bg-red-500',
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    description: 'Sync interview schedules with Google Calendar',
    category: 'calendar',
    authType: 'oauth2',
    icon: 'GC',
    color: 'bg-blue-500',
  },
  {
    id: 'outlook_calendar',
    name: 'Outlook Calendar',
    description: 'Sync interview schedules with Microsoft Outlook',
    category: 'calendar',
    authType: 'oauth2',
    icon: 'OC',
    color: 'bg-sky-600',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Sync candidates and jobs with Salesforce CRM',
    category: 'crm',
    authType: 'oauth2',
    icon: 'SF',
    color: 'bg-blue-600',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Sync contacts and deals with HubSpot CRM',
    category: 'crm',
    authType: 'oauth2',
    icon: 'HS',
    color: 'bg-orange-500',
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    description: 'Import candidates and applications from Greenhouse ATS',
    category: 'ats',
    authType: 'api_key',
    icon: 'GH',
    color: 'bg-emerald-500',
  },
  {
    id: 'lever',
    name: 'Lever',
    description: 'Sync opportunities and postings with Lever ATS',
    category: 'ats',
    authType: 'oauth2',
    icon: 'LV',
    color: 'bg-green-500',
  },
  {
    id: 'workday',
    name: 'Workday',
    description: 'Sync employee and position data with Workday HCM',
    category: 'hcm',
    authType: 'oauth2',
    icon: 'WD',
    color: 'bg-indigo-500',
  },
];

// =============================================================================
// API Function Stubs
// TODO: Implement these functions with actual HTTP client calls
// =============================================================================

export const integrationsApi = {
  // TODO: Implement - GET /integrations
  getIntegrations: async (): Promise<Integration[]> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /integrations/:provider
  getIntegration: async (provider: string): Promise<Integration | null> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /integrations/connect
  connect: async (provider: string): Promise<ConnectResponse> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /integrations/disconnect
  disconnect: async (provider: string): Promise<DisconnectResponse> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /integrations/mapping
  updateMapping: async (
    provider: string,
    mappings: MappingUpdatePayload['mappings'],
    direction?: SyncDirection
  ): Promise<{ success: boolean }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /integrations/sync
  triggerSync: async (provider: string, since?: Date): Promise<SyncResponse> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /integrations/:provider/webhooks
  getWebhookEvents: async (provider: string, limit?: number): Promise<{ events: WebhookEvent[] }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /integrations/:provider/metrics
  getMetrics: async (provider: string): Promise<IntegrationMetrics | null> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /integrations/:provider/fields
  getFieldSchemas: async (provider: string): Promise<FieldSchemasResponse> => {
    throw new Error('Not implemented');
  },

  // Static helper - returns available providers config
  getAvailableProviders: (): AvailableProvider[] => {
    return AVAILABLE_PROVIDERS;
  },
};
