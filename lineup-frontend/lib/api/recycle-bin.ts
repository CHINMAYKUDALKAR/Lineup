/**
 * Recycle Bin API Types and Contracts
 * 
 * This file defines the API contracts for recycle bin/soft-delete management.
 * Implementation logic should be added separately.
 */

// =============================================================================
// Types - Response Shapes
// =============================================================================

export interface RecycleBinItem {
  id: string;
  tenantId: string;
  module: string;  // 'candidate', 'interview', 'file', 'template'
  itemId: string;
  itemSnapshot: any;
  deletedBy: string;
  deletedAt: string;
  restoredAt: string | null;
  purgedAt: string | null;
  expiresAt: string | null;
}

export interface RecycleBinStats {
  total: number;
  byModule: { module: string; count: number }[];
}

export interface RecycleBinListResponse {
  data: RecycleBinItem[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    lastPage: number;
  };
}

// =============================================================================
// Request DTOs
// =============================================================================

export interface RecycleBinFilters {
  module?: string;
  from?: string;
  to?: string;
  deletedBy?: string;
  page?: number;
  perPage?: number;
}

// =============================================================================
// API Function Stubs
// TODO: Implement these functions with actual HTTP client calls
// =============================================================================

export const recycleBinApi = {
  // TODO: Implement - GET /recycle-bin
  getRecycleBinItems: async (filters?: RecycleBinFilters): Promise<RecycleBinListResponse> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /recycle-bin/stats
  getRecycleBinStats: async (): Promise<RecycleBinStats> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /recycle-bin/:id
  getRecycleBinItem: async (id: string): Promise<RecycleBinItem> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /recycle-bin/:id/restore
  restoreRecycleBinItem: async (id: string): Promise<{ success: boolean }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - DELETE /recycle-bin/:id
  purgeRecycleBinItem: async (id: string): Promise<{ success: boolean }> => {
    throw new Error('Not implemented');
  },
};
