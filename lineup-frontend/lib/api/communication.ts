/**
 * Communication API Types and Contracts
 * 
 * This file defines the API contracts for communication module endpoints.
 * Implementation logic should be added separately.
 */

// =============================================================================
// Types - Enums and Type Aliases
// =============================================================================

export type Channel = 'EMAIL' | 'WHATSAPP' | 'SMS';
export type MessageStatus = 'PENDING' | 'QUEUED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'BOUNCED';
export type RecipientType = 'CANDIDATE' | 'INTERVIEWER' | 'USER' | 'EXTERNAL';
export type TemplateCategory =
  | 'INTERVIEW_SCHEDULED' | 'INTERVIEW_REMINDER' | 'INTERVIEW_RESCHEDULED'
  | 'INTERVIEW_CANCELLED' | 'FEEDBACK_REQUEST' | 'OFFER_LETTER' | 'WELCOME' | 'CUSTOM';
export type AutomationTrigger =
  | 'INTERVIEW_SCHEDULED' | 'INTERVIEW_REMINDER_24H' | 'INTERVIEW_REMINDER_1H'
  | 'INTERVIEW_RESCHEDULED' | 'INTERVIEW_CANCELLED' | 'INTERVIEW_COMPLETED'
  | 'FEEDBACK_SUBMITTED' | 'CANDIDATE_STAGE_CHANGED' | 'OFFER_EXTENDED';

// =============================================================================
// Types - Response Shapes
// =============================================================================

export interface MessageLog {
  id: string;
  tenantId: string;
  channel: Channel;
  templateId: string | null;
  recipientType: RecipientType;
  recipientId: string;
  recipientEmail: string | null;
  recipientPhone: string | null;
  subject: string | null;
  body: string;
  status: MessageStatus;
  externalId: string | null;
  metadata: Record<string, any> | null;
  scheduledFor: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  failedAt: string | null;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MessageTemplate {
  id: string;
  tenantId: string;
  name: string;
  channel: Channel;
  category: TemplateCategory;
  subject: string | null;
  body: string;
  variables: string[];
  isSystem: boolean;
  isActive: boolean;
  version: number;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationRule {
  id: string;
  tenantId: string;
  name: string;
  trigger: AutomationTrigger;
  channel: Channel;
  templateId: string;
  template?: MessageTemplate;
  delay: number;
  conditions: Record<string, any> | null;
  isActive: boolean;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelConfig {
  id: string;
  tenantId: string;
  channel: Channel;
  provider: string;
  credentials: Record<string, any>;
  settings: Record<string, any> | null;
  isActive: boolean;
  isVerified: boolean;
  lastTestedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationStats {
  totalSent: number;
  totalPending: number;
  totalFailed: number;
  totalScheduled: number;
  byChannel: {
    email: number;
    whatsapp: number;
    sms: number;
  };
  recentActivity: Partial<MessageLog>[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// =============================================================================
// Request DTOs
// =============================================================================

export interface MessageFilters {
  channel?: Channel;
  status?: MessageStatus;
  recipientType?: RecipientType;
  recipientId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SendMessageDto {
  channel: Channel;
  recipientType: RecipientType;
  recipientId: string;
  templateId?: string;
  subject?: string;
  body?: string;
  context?: Record<string, any>;
}

export interface ScheduleMessageDto {
  channel: Channel;
  recipientType: RecipientType;
  recipientId: string;
  scheduledFor: string;
  templateId?: string;
  subject?: string;
  body?: string;
  context?: Record<string, any>;
}

export interface CreateTemplateDto {
  name: string;
  channel: Channel;
  category: TemplateCategory;
  subject?: string;
  body: string;
  variables?: string[];
}

export interface UpdateTemplateDto {
  name?: string;
  subject?: string;
  body?: string;
  variables?: string[];
  isActive?: boolean;
}

export interface CreateAutomationDto {
  name: string;
  trigger: AutomationTrigger;
  channel: Channel;
  templateId: string;
  delay?: number;
  conditions?: Record<string, any>;
}

export interface UpdateAutomationDto {
  name?: string;
  templateId?: string;
  delay?: number;
  conditions?: Record<string, any>;
  isActive?: boolean;
}

export interface UpdateChannelDto {
  credentials: Record<string, any>;
  settings?: Record<string, any>;
}

// =============================================================================
// API Function Stubs
// TODO: Implement these functions with actual HTTP client calls
// =============================================================================

export const communicationApi = {
  // Messages
  // TODO: Implement - GET /communication/messages
  getMessages: async (filters?: MessageFilters): Promise<PaginatedResponse<MessageLog>> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /communication/messages/:id
  getMessageDetail: async (id: string): Promise<MessageLog> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /communication/messages/send
  sendMessage: async (data: SendMessageDto): Promise<MessageLog> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /communication/messages/schedule
  scheduleMessage: async (data: ScheduleMessageDto): Promise<any> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /communication/messages/:id/retry
  retryMessage: async (id: string): Promise<{ success: boolean; messageId: string }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - DELETE /communication/messages/scheduled/:id
  cancelScheduledMessage: async (id: string): Promise<any> => {
    throw new Error('Not implemented');
  },

  // Templates
  // TODO: Implement - GET /communication/templates
  getTemplates: async (channel?: Channel, category?: TemplateCategory): Promise<MessageTemplate[]> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /communication/templates/:id
  getTemplate: async (id: string): Promise<MessageTemplate> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /communication/templates
  createTemplate: async (data: CreateTemplateDto): Promise<MessageTemplate> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PUT /communication/templates/:id
  updateTemplate: async (id: string, data: UpdateTemplateDto): Promise<MessageTemplate> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - DELETE /communication/templates/:id
  deleteTemplate: async (id: string): Promise<void> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /communication/templates/:id/preview
  previewTemplate: async (id: string, context: Record<string, any>): Promise<{ subject: string; body: string }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /communication/templates/:id/duplicate
  duplicateTemplate: async (id: string, name: string): Promise<MessageTemplate> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /communication/templates/variables
  getTemplateVariables: async (): Promise<Record<string, { name: string; description: string }[]>> => {
    throw new Error('Not implemented');
  },

  // Automations
  // TODO: Implement - GET /communication/automations
  getAutomations: async (): Promise<AutomationRule[]> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /communication/automations/:id
  getAutomation: async (id: string): Promise<AutomationRule> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /communication/automations
  createAutomation: async (data: CreateAutomationDto): Promise<AutomationRule> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PUT /communication/automations/:id
  updateAutomation: async (id: string, data: UpdateAutomationDto): Promise<AutomationRule> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - DELETE /communication/automations/:id
  deleteAutomation: async (id: string): Promise<void> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PATCH /communication/automations/:id/toggle
  toggleAutomation: async (id: string): Promise<AutomationRule> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /communication/automations/triggers
  getAutomationTriggers: async (): Promise<{ trigger: AutomationTrigger; description: string }[]> => {
    throw new Error('Not implemented');
  },

  // Channels
  // TODO: Implement - GET /communication/channels
  getChannels: async (): Promise<ChannelConfig[]> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /communication/channels/:channel
  getChannel: async (channel: Channel): Promise<ChannelConfig> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PUT /communication/channels/:channel
  updateChannel: async (channel: Channel, data: UpdateChannelDto): Promise<ChannelConfig> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /communication/channels/:channel/test
  testChannel: async (channel: Channel): Promise<{ success: boolean; message: string }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - DELETE /communication/channels/:channel
  deleteChannel: async (channel: Channel): Promise<void> => {
    throw new Error('Not implemented');
  },

  // Stats
  // TODO: Implement - GET /communication/stats
  getStats: async (): Promise<CommunicationStats> => {
    throw new Error('Not implemented');
  },
};

export default communicationApi;
