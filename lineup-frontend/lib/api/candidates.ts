/**
 * Candidates API Types and Contracts
 * 
 * This file defines the API contracts for candidates endpoints.
 * Implementation logic should be added separately.
 */

// =============================================================================
// Types - Response Shapes
// =============================================================================

export interface UploadUrlResponse {
  fileId: string;
  uploadUrl: string;
  s3Key: string;
}

export interface CandidateNoteResponse {
  id: string;
  candidateId: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  tenantId: string;
  name: string;
  email?: string;
  phone?: string;
  roleTitle?: string;
  stage: string;
  source?: string;
  tags?: string[];
  resumeUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateListResponse {
  data: Candidate[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

// =============================================================================
// Request DTOs
// =============================================================================

export interface AttachResumeRequest {
  fileId: string;
  s3Key: string;
  mimeType?: string;
  size?: number;
}

export interface ListCandidatesParams {
  page?: number;
  perPage?: number;
  stage?: string;
  source?: string;
  role?: string;
  q?: string;
}

export interface CreateCandidateDto {
  name: string;
  email?: string;
  phone?: string;
  roleTitle?: string;
  stage?: string;
  source?: string;
  tags?: string[];
}

export interface UpdateCandidateDto {
  name?: string;
  email?: string;
  phone?: string;
  roleTitle?: string;
  stage?: string;
  source?: string;
  tags?: string[];
}

// =============================================================================
// API Function Stubs
// TODO: Implement these functions with actual HTTP client calls
// =============================================================================

export const candidatesApi = {
  // TODO: Implement - GET /candidates/:id
  getCandidate: async (candidateId: string): Promise<Candidate> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /candidates
  listCandidates: async (params?: ListCandidatesParams): Promise<CandidateListResponse> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /candidates
  createCandidate: async (data: CreateCandidateDto): Promise<Candidate> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PATCH /candidates/:id
  updateCandidate: async (id: string, data: UpdateCandidateDto): Promise<Candidate> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - DELETE /candidates/:id
  deleteCandidate: async (id: string): Promise<{ success: boolean }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /candidates/:id/resume/upload-url
  getResumeUploadUrl: async (candidateId: string, filename: string): Promise<UploadUrlResponse> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /candidates/:id/resume/attach
  attachResume: async (candidateId: string, data: AttachResumeRequest): Promise<{ fileId: string }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /candidates/:id/documents
  getCandidateDocuments: async (candidateId: string): Promise<{ data: any[] }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /candidates/:id/notes
  getCandidateNotes: async (candidateId: string): Promise<{ data: CandidateNoteResponse[] }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /candidates/:id/notes
  addCandidateNote: async (candidateId: string, content: string): Promise<CandidateNoteResponse> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PATCH /candidates/:id/notes/:noteId
  updateCandidateNote: async (candidateId: string, noteId: string, content: string): Promise<CandidateNoteResponse> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - DELETE /candidates/:id/notes/:noteId
  deleteCandidateNote: async (candidateId: string, noteId: string): Promise<{ success: boolean }> => {
    throw new Error('Not implemented');
  },
};
