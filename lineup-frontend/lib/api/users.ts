/**
 * Users API Types and Contracts
 * 
 * This file defines the API contracts for users and teams endpoints.
 * Implementation logic should be added separately.
 */

// =============================================================================
// Types - Response Shapes
// =============================================================================

export type UserRole = "ADMIN" | "MANAGER" | "RECRUITER" | "INTERVIEWER" | "SUPERADMIN" | "SUPPORT";
export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "active" | "inactive" | "pending";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  teams?: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  leadId: string;
  memberIds: string[];
  createdAt: string;
}

// =============================================================================
// Request DTOs
// =============================================================================

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface CreateTeamDto {
  name: string;
  description?: string;
  leadId?: string;
}

export interface InviteUserDto {
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
}

// =============================================================================
// Paginated Response
// =============================================================================

export interface UsersListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export interface TeamsListResponse {
  data: Team[];
  total: number;
  page: number;
  limit: number;
}

// =============================================================================
// API Function Stubs
// TODO: Implement these functions with actual HTTP client calls
// =============================================================================

export const usersApi = {
  // TODO: Implement - GET /users
  getUsers: async (params?: GetUsersParams): Promise<UsersListResponse> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /users/invite
  inviteUser: async (data: InviteUserDto): Promise<User> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PATCH /users/:id
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /users/:id/deactivate
  deleteUser: async (id: string): Promise<{ success: boolean }> => {
    throw new Error('Not implemented');
  },
};

export const teamsApi = {
  // TODO: Implement - GET /teams
  getTeams: async (params?: { page?: number; limit?: number; search?: string }): Promise<TeamsListResponse> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - GET /teams/:id
  getTeam: async (id: string): Promise<Team> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /teams
  createTeam: async (data: CreateTeamDto): Promise<Team> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - PATCH /teams/:id
  updateTeam: async (id: string, data: Partial<CreateTeamDto>): Promise<Team> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - DELETE /teams/:id
  deleteTeam: async (id: string): Promise<{ success: boolean }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - POST /teams/:id/members
  addTeamMember: async (teamId: string, userId: string, role?: string): Promise<{ success: boolean }> => {
    throw new Error('Not implemented');
  },

  // TODO: Implement - DELETE /teams/:id/members/:userId
  removeTeamMember: async (teamId: string, userId: string): Promise<{ success: boolean }> => {
    throw new Error('Not implemented');
  },
};

// Compatibility exports - kept empty for type compatibility
export const mockUsers: User[] = [];
export const mockTeams: Team[] = [];
