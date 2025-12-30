import { Injectable } from '@nestjs/common';
import { IntegrationProvider } from '../../types/provider.interface';
import {
    ProviderCapabilities,
    StandardCandidate,
    StandardJob,
    SyncResult,
} from '../../types/standard-entities';

/**
 * Lever Integration Provider
 *
 * EXTENSION POINT: ATS integration for syncing candidates and postings.
 *
 * TODO: Implement Lever adapter
 * Responsibilities:
 * - Authenticate via OAuth 2.0
 * - Map Lever Opportunities to Lineup Candidates
 * - Map Lever Postings to Lineup Jobs
 * - Handle Lever webhooks
 *
 * Authentication approach:
 * - OAuth 2.0 authorization code flow
 * - Auth: https://auth.lever.co/authorize
 * - Token: https://auth.lever.co/oauth/token
 * - Scope: offline_access, candidates:read, postings:read
 *
 * Data mapping responsibility:
 * - Opportunity.contact.name -> Candidate.name
 * - Opportunity.contact.emails[0] -> Candidate.email
 * - Opportunity.stage.text -> Candidate.stage
 * - Posting.text -> Job.title
 *
 * Rate limiting:
 * - 10 requests per second
 * - Use expand parameter to reduce calls
 */
@Injectable()
export class LeverProvider implements IntegrationProvider {
    getCapabilities(): ProviderCapabilities {
        return {
            candidateSync: 'bidirectional',
            jobSync: 'read',
            interviewSync: 'read',
            supportsWebhooks: true,
        };
    }

    async getAuthUrl(tenantId: string, state?: string): Promise<string> {
        // TODO: Build auth URL with scopes
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

    async handleWebhook?(tenantId: string, event: any): Promise<void> {
        throw new Error('TODO: Implement handleWebhook');
    }
}

