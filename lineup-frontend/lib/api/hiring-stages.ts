/**
 * Hiring Stages API Types and Contracts
 * 
 * This file defines the API contracts for hiring stages management.
 * Implementation logic should be added separately.
 */

// =============================================================================
// Types - Response Shapes
// =============================================================================

export interface HiringStage {
  id: string;
  tenantId: string;
  name: string;
  key: string;
  order: number;
  color: string | null;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Request DTOs
// =============================================================================

export interface CreateHiringStageDto {
  name: string;
  key: string;
  color?: string;
  isDefault?: boolean;
}

export interface UpdateHiringStageDto {
  name?: string;
  color?: string;
  isActive?: boolean;
  isDefault?: boolean;
}

// =============================================================================
// API Function Stubs
// TODO: Implement these functions with actual HTTP client calls
// =============================================================================

export const hiringStagesApi = {
  // TODO: Implement - GET /settings/stages
  getHiringStages: async (includeInactive?: boolean): Promise<HiringStage[]> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /settings/stages/:id
  getHiringStage: async (id: string): Promise<HiringStage> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /settings/stages
  createHiringStage: async (dto: CreateHiringStageDto): Promise<HiringStage> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PUT /settings/stages/:id
  updateHiringStage: async (id: string, dto: UpdateHiringStageDto): Promise<HiringStage> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PATCH /settings/stages/reorder
  reorderHiringStages: async (stageIds: string[]): Promise<HiringStage[]> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PATCH /settings/stages/:id/toggle
  toggleHiringStage: async (id: string): Promise<HiringStage> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - DELETE /settings/stages/:id
  deleteHiringStage: async (id: string): Promise<{ success: boolean }> => {
    throw new Error('Not implemented');
  },
};
