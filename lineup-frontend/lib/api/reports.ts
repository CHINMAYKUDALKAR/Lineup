/**
 * Reports API Types and Contracts
 * 
 * This file defines the API contracts for reports and analytics endpoints.
 * Implementation logic should be added separately.
 */

// =============================================================================
// Types - Enums
// =============================================================================

export type ReportType =
  | 'overview'
  | 'funnel'
  | 'time-to-hire'
  | 'interviewer-load'
  | 'source-performance'
  | 'stage-metrics';

export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly';

// =============================================================================
// Types - Response Shapes
// =============================================================================

export interface ScheduledReport {
  id: string;
  tenantId: string;
  reportType: ReportType;
  frequency: ScheduleFrequency;
  recipients: string[];
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  name?: string;
  isActive: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  createdAt: string;
  createdById: string;
}

export interface OverviewReport {
  funnel: FunnelStage[];
  timeToHire: TimeToHireData;
  interviewerLoad: InterviewerLoadData[];
  totalCandidates: number;
  activeInterviews: number;
  completedThisWeek: number;
  pendingFeedback: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage?: number;
}

export interface TimeToHireData {
  averageDays: number;
  byStage?: {
    stage: string;
    averageDays: number;
  }[];
}

export interface InterviewerLoadData {
  interviewerId: string;
  interviewerName: string;
  totalInterviews: number;
  thisWeek: number;
  thisMonth: number;
  pendingFeedback: number;
}

// =============================================================================
// Request DTOs
// =============================================================================

export interface CreateScheduledReportDto {
  reportType: ReportType;
  frequency: ScheduleFrequency;
  recipients: string[];
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  name?: string;
}

// =============================================================================
// API Function Stubs
// TODO: Implement these functions with actual HTTP client calls
// =============================================================================

export const reportsApi = {
  // Report Data
  // TODO: Implement - GET /reports/overview
  getOverview: async (refresh?: boolean): Promise<OverviewReport> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /reports/funnel
  getFunnel: async (refresh?: boolean): Promise<FunnelStage[]> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /reports/time-to-hire
  getTimeToHire: async (refresh?: boolean): Promise<TimeToHireData> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /reports/interviewer-load
  getInterviewerLoad: async (refresh?: boolean): Promise<InterviewerLoadData[]> => {
    throw new Error('Not implemented');
  },

  // Export Functions
  // TODO: Implement - GET /reports/export/csv/:reportType
  exportReportCsv: async (reportType: ReportType): Promise<void> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /reports/export/pdf/:reportType
  exportReportPdf: async (reportType: ReportType): Promise<void> => {
    throw new Error('Not implemented');
  },

  // Scheduled Reports
  // TODO: Implement - GET /reports/schedules
  getScheduledReports: async (): Promise<ScheduledReport[]> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /reports/schedules
  createScheduledReport: async (dto: CreateScheduledReportDto): Promise<ScheduledReport> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - DELETE /reports/schedules/:id
  deleteScheduledReport: async (id: string): Promise<void> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /reports/schedules/:id/toggle
  toggleScheduledReport: async (id: string): Promise<ScheduledReport> => {
    throw new Error('Not implemented');
  },
};
