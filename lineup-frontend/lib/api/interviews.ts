/**
 * Interviews API Types and Contracts
 * 
 * This file defines the API contracts for interview-related endpoints.
 * Implementation logic should be added separately.
 */

// =============================================================================
// Types - Response Shapes
// =============================================================================

export interface Interview {
  id: string;
  tenantId: string;
  candidateId: string;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
  roleTitle?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  durationMins: number;
  stage: string;
  status: string;
  type: string;
  location?: string;
  meetingLink?: string;
  interviewers: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewListResponse {
  data: Interview[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface InterviewNote {
  id: string;
  interviewId: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TimelineItem {
  type: 'note' | 'feedback' | 'activity';
  id: string;
  createdAt: string;
  author?: {
    id: string;
    name: string | null;
    email: string;
  };
  content?: string;
  rating?: number;
  action?: string;
}

// =============================================================================
// Request DTOs
// =============================================================================

export interface GetInterviewsParams {
  page?: number;
  perPage?: number;
  from?: string;
  to?: string;
  status?: string;
  candidateId?: string;
  interviewerId?: string;
}

export interface CreateInterviewDto {
  candidateId: string;
  date: string;
  startTime?: string;
  durationMins?: number;
  stage?: string;
  type?: string;
  location?: string;
  meetingLink?: string;
  interviewerIds?: string[];
  notes?: string;
  candidateEmailSubject?: string;
  candidateEmailBody?: string;
  interviewerEmailSubject?: string;
  interviewerEmailBody?: string;
}

export interface RescheduleInterviewDto {
  newDate: string;
  newStartTime?: string;
  reason?: string;
}

// =============================================================================
// API Function Stubs
// TODO: Implement these functions with actual HTTP client calls
// =============================================================================

export const interviewsApi = {
  // TODO: Implement - GET /interviews
  getInterviews: async (params?: GetInterviewsParams): Promise<InterviewListResponse> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /interviews/:id
  getInterview: async (id: string): Promise<Interview> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /interviews
  createInterview: async (data: CreateInterviewDto): Promise<Interview> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /interviews/reschedule/:id
  rescheduleInterview: async (id: string, data: RescheduleInterviewDto): Promise<Interview> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /interviews/:id/cancel
  cancelInterview: async (id: string): Promise<{ success: boolean }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /interviews/:id/complete
  completeInterview: async (id: string): Promise<Interview> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /interviews/:id/notes
  getInterviewNotes: async (interviewId: string): Promise<{ data: InterviewNote[] }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /interviews/:id/notes
  addInterviewNote: async (interviewId: string, content: string): Promise<InterviewNote> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PATCH /interviews/:id/notes/:noteId
  updateInterviewNote: async (interviewId: string, noteId: string, content: string): Promise<InterviewNote> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - DELETE /interviews/:id/notes/:noteId
  deleteInterviewNote: async (interviewId: string, noteId: string): Promise<{ success: boolean }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /interviews/:id/timeline
  getInterviewTimeline: async (interviewId: string): Promise<{ data: TimelineItem[] }> => {
    throw new Error('Not implemented');
  },
};
