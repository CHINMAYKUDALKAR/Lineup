import { Injectable } from '@nestjs/common';
import { IntegrationProvider } from '../../types/provider.interface';
import {
    ProviderCapabilities,
    StandardCandidate,
    StandardJob,
    SyncResult,
} from '../../types/standard-entities';

/**
 * Greenhouse Integration Provider
 *
 * EXTENSION POINT: ATS integration for syncing candidates and jobs.
 *
 * TODO: Implement Greenhouse adapter
 * Responsibilities:
 * - Authenticate via API key (Harvest API)
 * - Map Greenhouse Candidates to Lineup Candidates
 * - Map Greenhouse Jobs to Lineup Jobs
 * - Handle Greenhouse webhooks for real-time updates
 *
 * Authentication approach:
 * - Basic Auth with API key as username, empty password
 * - API key generated in Greenhouse Settings > Dev Center
 * - No OAuth flow - key is set per tenant in settings
 *
 * Data mapping responsibility:
 * - Candidate.first_name + last_name -> Candidate.name
 * - Candidate.email_addresses[0].value -> Candidate.email
 * - Candidate.applications[0].current_stage.name -> Candidate.stage
 * - Job.name -> Job.title
 * - Job.offices[0].location.name -> Job.location
 *
 * Error handling expectations:
 * - 401: Invalid API key, require reconfiguration
 * - 429: Rate limit, back off and retry
 *
 * Rate limiting / retry considerations:
 * - 50 requests per 10 seconds
 * - Use Link header for pagination
 * - Webhook preferred for real-time updates
 */
@Injectable()
export class GreenhouseProvider implements IntegrationProvider {
    getCapabilities(): ProviderCapabilities {
        return {
            candidateSync: 'bidirectional',
            jobSync: 'read', // Pull jobs from Greenhouse
            interviewSync: 'read', // Can read scheduled interviews
            supportsWebhooks: true,
        };
    }

    /**
     * Greenhouse uses API key auth, not OAuth
     * TODO: Return configuration URL or throw NotSupported
     */
    async getAuthUrl(tenantId: string, state?: string): Promise<string> {
        // Greenhouse uses API key - redirect to settings page
        throw new Error('Greenhouse uses API key authentication, not OAuth');
    }

    /**
     * TODO: Store API key from tenant configuration
     */
    async exchangeCode(tenantId: string, code: string): Promise<void> {
        throw new Error('TODO: Implement API key storage');
    }

    /**
     * API keys don't expire - no refresh needed
     */
    async refreshTokens(tenantId: string): Promise<void> {
        // No-op: API keys don't expire
    }

    /**
     * TODO: POST to /v1/candidates
     */
    async pushCandidate?(tenantId: string, candidate: StandardCandidate): Promise<SyncResult> {
        throw new Error('TODO: Implement pushCandidate');
    }

    /**
     * TODO: GET /v1/candidates with updated_after filter
     */
    async pullCandidates?(tenantId: string, since?: Date): Promise<StandardCandidate[]> {
        throw new Error('TODO: Implement pullCandidates');
    }

    /**
     * TODO: GET /v1/jobs
     */
    async pullJobs?(tenantId: string, since?: Date): Promise<StandardJob[]> {
        throw new Error('TODO: Implement pullJobs');
    }

    /**
     * TODO: Handle Greenhouse webhook events
     * Events: candidate_hired, application_updated, etc.
     */
    async handleWebhook?(tenantId: string, event: any): Promise<void> {
        throw new Error('TODO: Implement handleWebhook');
    }
}

