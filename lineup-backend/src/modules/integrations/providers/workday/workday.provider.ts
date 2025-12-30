import { Injectable } from '@nestjs/common';
import { IntegrationProvider } from '../../types/provider.interface';
import {
    ProviderCapabilities,
    StandardCandidate,
    StandardJob,
    SyncResult,
} from '../../types/standard-entities';

/**
 * Workday Integration Provider
 *
 * EXTENSION POINT: HRIS/ATS integration for syncing candidates and requisitions.
 *
 * TODO: Implement Workday adapter
 * Responsibilities:
 * - Authenticate via OAuth 2.0 or ISU (Integration System User)
 * - Map Workday Candidates to Lineup Candidates
 * - Map Workday Job Requisitions to Lineup Jobs
 * - Handle Workday Integration Events
 *
 * Authentication approach:
 * - OAuth 2.0 for partner integrations
 * - ISU with API client credentials for direct integrations
 * - Token endpoint varies by tenant (tenant-specific URL)
 *
 * Data mapping responsibility:
 * - Worker/Candidate Name fields -> Candidate.name
 * - Uses WID (Workday ID) as external ID
 * - Job_Requisition -> Job with complex nested mapping
 *
 * Rate limiting:
 * - Varies by tenant subscription
 * - Use Workday Web Services for bulk operations
 */
@Injectable()
export class WorkdayProvider implements IntegrationProvider {
    getCapabilities(): ProviderCapabilities {
        return {
            candidateSync: 'bidirectional',
            jobSync: 'read',
            interviewSync: 'none',
            supportsWebhooks: false, // Uses integration events
        };
    }

    async getAuthUrl(tenantId: string, state?: string): Promise<string> {
        throw new Error('TODO: Implement getAuthUrl');
    }

    async exchangeCode(tenantId: string, code: string): Promise<void> {
        throw new Error('TODO: Implement exchangeCode');
    }

    async refreshTokens(tenantId: string): Promise<void> {
        throw new Error('TODO: Implement refreshTokens');
    }

    async pushCandidate?(tenantId: string, candidate: StandardCandidate): Promise<SyncResult> {
        throw new Error('TODO: Implement pushCandidate');
    }

    async pullCandidates?(tenantId: string, since?: Date): Promise<StandardCandidate[]> {
        throw new Error('TODO: Implement pullCandidates');
    }

    async pullJobs?(tenantId: string, since?: Date): Promise<StandardJob[]> {
        throw new Error('TODO: Implement pullJobs');
    }
}

