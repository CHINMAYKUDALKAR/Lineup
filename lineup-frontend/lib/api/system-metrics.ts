/**
 * System Metrics API Types and Contracts
 * 
 * This file defines the API contracts for system metrics and monitoring.
 * Implementation logic should be added separately.
 */

// =============================================================================
// Types - Response Shapes
// =============================================================================

export interface PlatformMetrics {
  totalTenants: number;
  activeTenants: number;
  totalUsers: number;
  activeUsers: number;
  totalCandidates: number;
  totalInterviews: number;
  systemLoad: number;
  memoryUsage: number;
  uptime: number;
}

export interface QueueMetrics {
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: boolean;
}

export interface CommunicationMetrics {
  emailsSent: number;
  emailsDelivered: number;
  emailsFailed: number;
  smsSent: number;
  whatsappSent: number;
  deliveryRate: number;
}

export interface SchedulingMetrics {
  interviewsScheduled: number;
  interviewsCompleted: number;
  interviewsCancelled: number;
  averageDuration: number;
  noShowRate: number;
}

export interface TenantUsageMetrics {
  tenantId: string;
  tenantName: string;
  users: number;
  candidates: number;
  interviews: number;
  storage: number;
  apiCalls: number;
}

// =============================================================================
// API Function Stubs
// TODO: Implement these functions with actual HTTP client calls
// =============================================================================

export const systemMetricsApi = {
  // TODO: Implement - GET /system-metrics/platform
  getPlatformMetrics: async (): Promise<PlatformMetrics> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /system-metrics/queues
  getQueueMetrics: async (): Promise<QueueMetrics[]> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /system-metrics/communication
  getCommunicationMetrics: async (): Promise<CommunicationMetrics> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /system-metrics/scheduling
  getSchedulingMetrics: async (): Promise<SchedulingMetrics> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /system-metrics/tenant-usage
  getTenantUsageMetrics: async (): Promise<TenantUsageMetrics[]> => {
    throw new Error('Not implemented');
  },
};
