import { Injectable } from '@nestjs/common';
import { IntegrationProvider } from '../../types/provider.interface';
import { ProviderCapabilities, StandardCandidate, SyncResult } from '../../types/standard-entities';

/**
 * Zoho CRM Integration Provider
 *
 * EXTENSION POINT: CRM integration for syncing leads and contacts.
 *
 * TODO: Implement Zoho adapter
 * Responsibilities:
 * - Authenticate via OAuth 2.0
 * - Map Zoho Leads/Contacts to Lineup Candidates
 * - Handle Zoho Notification webhooks
 *
 * Authentication approach:
 * - OAuth 2.0 authorization code flow
 * - Auth: https://accounts.zoho.com/oauth/v2/auth
 * - Token: https://accounts.zoho.com/oauth/v2/token
 * - Scopes: ZohoCRM.modules.ALL, ZohoCRM.settings.ALL
 * - Note: Data center specific URLs (zoho.com, zoho.eu, zoho.in, etc.)
 *
 * Data mapping responsibility:
 * - Lead.First_Name + Lead.Last_Name -> Candidate.name
 * - Lead.Email -> Candidate.email
 * - Lead.Lead_Status -> Candidate.stage
 * - Contact fields similar mapping
 *
 * Rate limiting:
 * - 15,000 API credits per day (Standard edition)
 * - Use upsert for efficient sync
 */
@Injectable()
export class ZohoProvider implements IntegrationProvider {
    getCapabilities(): ProviderCapabilities {
        return {
            candidateSync: 'bidirectional',
            jobSync: 'none',
            interviewSync: 'none',
            supportsWebhooks: true,
        };
    }

    async getAuthUrl(tenantId: string, state?: string): Promise<string> {
        // TODO: Build Zoho OAuth URL with appropriate scopes
        throw new Error('TODO: Implement getAuthUrl');
    }

    async exchangeCode(tenantId: string, code: string): Promise<void> {
        // TODO: Exchange code, store api_domain from response
        throw new Error('TODO: Implement exchangeCode');
    }

    async refreshTokens(tenantId: string): Promise<void> {
        throw new Error('TODO: Implement refreshTokens');
    }

    async pushCandidate?(tenantId: string, candidate: StandardCandidate): Promise<SyncResult> {
        // TODO: Upsert to /crm/v2/Leads or /crm/v2/Contacts
        throw new Error('TODO: Implement pushCandidate');
    }

    async pullCandidates?(tenantId: string, since?: Date): Promise<StandardCandidate[]> {
        // TODO: GET /crm/v2/Leads with Modified_Time filter
        throw new Error('TODO: Implement pullCandidates');
    }

    async handleWebhook?(tenantId: string, event: any): Promise<void> {
        throw new Error('TODO: Implement handleWebhook');
    }
}

