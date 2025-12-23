/**
 * Calendar API Types and Contracts
 * 
 * This file defines the API contracts for calendar, scheduling, and availability endpoints.
 * Implementation logic should be added separately.
 */

// =============================================================================
// Core Types - Response Shapes
// =============================================================================

export interface TimeInterval {
  start: string;
  end: string;
}

export interface WeeklyPattern {
  dow: number;
  start: string;
  end: string;
}

export interface WorkingHours {
  id: string;
  tenantId: string;
  userId: string;
  weekly: WeeklyPattern[];
  timezone: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusyBlock {
  id: string;
  tenantId: string;
  userId: string;
  startAt: string;
  endAt: string;
  reason?: string;
  source: 'manual' | 'calendar_sync' | 'interview';
  sourceId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SchedulingRule {
  id: string;
  tenantId: string;
  name: string;
  minNoticeMins: number;
  bufferBeforeMins: number;
  bufferAfterMins: number;
  defaultSlotMins: number;
  allowOverlapping: boolean;
  isDefault: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type SlotStatus = 'AVAILABLE' | 'BOOKED' | 'CANCELLED' | 'EXPIRED';

export interface SlotParticipant {
  type: 'user' | 'candidate';
  id: string;
  email?: string;
  phone?: string;
  name?: string;
}

export interface InterviewSlot {
  id: string;
  tenantId: string;
  interviewId?: string;
  organizerId?: string;
  participants: SlotParticipant[];
  startAt: string;
  endAt: string;
  timezone: string;
  status: SlotStatus;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  durationMins: number;
}

export interface AvailabilityResult {
  userId: string;
  intervals: TimeInterval[];
}

export interface MultiUserAvailabilityResult {
  individual: AvailabilityResult[];
  combined: TimeSlot[];
}

export interface PaginatedSlots {
  items: InterviewSlot[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// =============================================================================
// Request DTOs
// =============================================================================

export interface SetWorkingHoursDto {
  userId?: string;
  weekly: WeeklyPattern[];
  timezone: string;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface CreateBusyBlockDto {
  userId?: string;
  startAt: string;
  endAt: string;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface CreateSchedulingRuleDto {
  name: string;
  minNoticeMins?: number;
  bufferBeforeMins?: number;
  bufferAfterMins?: number;
  defaultSlotMins?: number;
  allowOverlapping?: boolean;
  isDefault?: boolean;
}

export interface UpdateSchedulingRuleDto extends Partial<CreateSchedulingRuleDto> { }

export interface CreateSlotDto {
  participants: SlotParticipant[];
  startAt: string;
  endAt: string;
  timezone: string;
  metadata?: Record<string, any>;
}

export interface GenerateSlotsDto {
  userIds: string[];
  startRange: string;
  endRange: string;
  slotDurationMins: number;
  ruleId?: string;
  timezone: string;
}

export interface BookSlotDto {
  interviewId?: string;
  candidate: SlotParticipant;
  candidateId?: string;
  metadata?: Record<string, any>;
}

export interface RescheduleSlotDto {
  newStartAt: string;
  newEndAt: string;
  reason?: string;
}

export interface SlotQueryParams {
  status?: SlotStatus;
  userId?: string;
  start?: string;
  end?: string;
  page?: number;
  perPage?: number;
}

export interface AvailabilityQueryParams {
  userIds: string[];
  start: string;
  end: string;
  durationMins?: number;
  timezone?: string;
}

export interface BusyBlockQueryParams {
  userId?: string;
  start?: string;
  end?: string;
  source?: string;
}

// =============================================================================
// Suggestions & Team Availability Types
// =============================================================================

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'any';

export interface SlotPreferences {
  preferredTimeOfDay?: TimeOfDay;
  preferredDays?: number[]; // 0-6 (Sun-Sat)
  avoidBackToBack?: boolean;
  minGapBetweenInterviewsMins?: number;
}

export interface SuggestionQuery {
  userIds: string[];
  candidateId?: string;
  durationMins: number;
  startRange: string;
  endRange: string;
  maxSuggestions?: number;
  preferences?: SlotPreferences;
  ruleId?: string;
}

export interface SlotSuggestion {
  start: string;
  end: string;
  score: number;
  reasons: string[];
  userAvailability: Record<string, boolean>;
}

export interface SuggestionResponse {
  suggestions: SlotSuggestion[];
  totalAvailableSlots: number;
  queryRange: {
    start: string;
    end: string;
  };
  processingTimeMs: number;
}

export interface TeamAvailabilityQuery {
  userIds: string[];
  start: string;
  end: string;
  slotDurationMins?: number;
}

export interface UserAvailability {
  userId: string;
  userName?: string;
  intervals: Array<{
    start: string;
    end: string;
  }>;
}

export interface TeamAvailabilityResponse {
  userAvailability: UserAvailability[];
  commonSlots: Array<{
    start: string;
    end: string;
  }>;
  queryRange: {
    start: string;
    end: string;
  };
}

// =============================================================================
// Calendar Sync Types
// =============================================================================

export interface CalendarSyncAccount {
  id: string;
  provider: 'google' | 'microsoft';
  providerAccountId: string;
  syncEnabled: boolean;
  lastSyncAt: string | null;
}

export interface ConnectedAccountsResponse {
  accounts: CalendarSyncAccount[];
}

export interface AuthUrlResponse {
  authUrl: string;
}

export interface CalendarCallbackParams {
  code: string;
  redirectUri: string;
}

export interface SyncResult {
  success: boolean;
  eventsProcessed: number;
}

// =============================================================================
// API Function Stubs
// TODO: Implement these functions with actual HTTP client calls
// =============================================================================

export const calendarApi = {
  // Availability
  // TODO: Implement - GET /calendar/availability
  getAvailability: async (params: AvailabilityQueryParams): Promise<MultiUserAvailabilityResult> => {
    throw new Error('Not implemented');
  },

  // Slots
  // TODO: Implement - GET /calendar/slots
  getSlots: async (params?: SlotQueryParams): Promise<PaginatedSlots> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /calendar/slots/:id
  getSlot: async (id: string): Promise<InterviewSlot> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /calendar/slots
  createSlot: async (data: CreateSlotDto): Promise<InterviewSlot> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /calendar/slots/generate
  generateSlots: async (data: GenerateSlotsDto): Promise<InterviewSlot[]> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /calendar/slots/:id/book
  bookSlot: async (id: string, data: BookSlotDto): Promise<InterviewSlot> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PATCH /calendar/slots/:id/reschedule
  rescheduleSlot: async (id: string, data: RescheduleSlotDto): Promise<InterviewSlot> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /calendar/slots/:id/cancel
  cancelSlot: async (id: string): Promise<InterviewSlot> => {
    throw new Error('Not implemented');
  },

  // Working Hours
  // TODO: Implement - GET /calendar/working-hours
  getWorkingHours: async (userId?: string): Promise<WorkingHours | null> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PUT /calendar/working-hours
  setWorkingHours: async (data: SetWorkingHoursDto): Promise<WorkingHours> => {
    throw new Error('Not implemented');
  },

  // Busy Blocks
  // TODO: Implement - GET /calendar/busy-blocks
  getBusyBlocks: async (params?: BusyBlockQueryParams): Promise<BusyBlock[]> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /calendar/busy-blocks
  createBusyBlock: async (data: CreateBusyBlockDto): Promise<BusyBlock> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - DELETE /calendar/busy-blocks/:id
  deleteBusyBlock: async (id: string): Promise<void> => {
    throw new Error('Not implemented');
  },

  // Scheduling Rules
  // TODO: Implement - GET /calendar/rules
  getSchedulingRules: async (): Promise<SchedulingRule[]> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /calendar/rules/:id
  getSchedulingRule: async (id: string): Promise<SchedulingRule> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /calendar/rules
  createSchedulingRule: async (data: CreateSchedulingRuleDto): Promise<SchedulingRule> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PUT /calendar/rules/:id
  updateSchedulingRule: async (id: string, data: UpdateSchedulingRuleDto): Promise<SchedulingRule> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - DELETE /calendar/rules/:id
  deleteSchedulingRule: async (id: string): Promise<void> => {
    throw new Error('Not implemented');
  },

  // Suggestions
  // TODO: Implement - POST /calendar/suggestions
  getSuggestions: async (data: SuggestionQuery): Promise<SuggestionResponse> => {
    throw new Error('Not implemented');
  },

  // Team Availability
  // TODO: Implement - GET /calendar/team-availability
  getTeamAvailability: async (params: TeamAvailabilityQuery): Promise<TeamAvailabilityResponse> => {
    throw new Error('Not implemented');
  },
};

export const calendarSyncApi = {
  // TODO: Implement - GET /calendar/sync/accounts
  getConnectedCalendarAccounts: async (): Promise<ConnectedAccountsResponse> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /calendar/sync/google/auth-url
  getGoogleAuthUrl: async (redirectUri: string): Promise<AuthUrlResponse> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /calendar/sync/google/callback
  googleCalendarCallback: async (params: CalendarCallbackParams): Promise<{ success: boolean; accountId: string }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - DELETE /calendar/sync/google
  disconnectGoogleCalendar: async (): Promise<{ success: boolean }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /calendar/sync/microsoft/auth-url
  getMicrosoftAuthUrl: async (redirectUri: string): Promise<AuthUrlResponse> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /calendar/sync/microsoft/callback
  microsoftCalendarCallback: async (params: CalendarCallbackParams): Promise<{ success: boolean; accountId: string }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - DELETE /calendar/sync/microsoft
  disconnectMicrosoftCalendar: async (): Promise<{ success: boolean }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /calendar/sync/:id/sync
  syncCalendarAccount: async (accountId: string): Promise<SyncResult> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PATCH /calendar/sync/:id/toggle
  toggleCalendarSync: async (accountId: string, enabled: boolean): Promise<{ success: boolean }> => {
    throw new Error('Not implemented');
  },
};
