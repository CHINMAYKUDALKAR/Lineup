import { Injectable } from '@nestjs/common';
import { IntegrationProvider } from '../../types/provider.interface';
import { ProviderCapabilities, StandardCandidate, SyncResult } from '../../types/standard-entities';

/**
 * BambooHR Integration Provider
 *
 * EXTENSION POINT: HRIS integration for syncing employee/candidate data.
 *
 * TODO: Implement BambooHR adapter
 * Responsibilities:
 * - Authenticate via API key with company domain
 * - Map BambooHR Employees to Lineup Candidates (for internal mobility)
 * - Map BambooHR Applicants to Lineup Candidates
 *
 * Authentication approach:
 * - API key authentication (basic auth, key as password)
 * - Company domain required: https://api.bamboohr.com/api/gateway.php/{companyDomain}/v1/
 * - No OAuth - key is configured per tenant
 *
 * Data mapping responsibility:
 * - Employee.firstName + lastName -> Candidate.name
 * - Employee.workEmail -> Candidate.email
 * - Employee.jobTitle -> Candidate.roleTitle
 *
 * Rate limiting:
 * - No published rate limits
 * - Use bulk endpoints where available
 */
@Injectable()
export class BambooHRProvider implements IntegrationProvider {
    getCapabilities(): ProviderCapabilities {
        return {
            candidateSync: 'read', // Pull from BambooHR
            jobSync: 'none',
            interviewSync: 'none',
            supportsWebhooks: true,
        };
    }

    async getAuthUrl(tenantId: string, state?: string): Promise<string> {
        // BambooHR uses API key - redirect to configuration page
        throw new Error('BambooHR uses API key authentication, not OAuth');
    }

    async exchangeCode(tenantId: string, code: string, companyDomain?: string): Promise<void> {
        // TODO: Store API key and company domain
        throw new Error('TODO: Implement API key storage');
    }

    async refreshTokens(tenantId: string): Promise<void> {
        // No-op: API keys don't expire
    }

    async pullCandidates?(tenantId: string, since?: Date): Promise<StandardCandidate[]> {
        // TODO: GET /employees/directory or /applicant_tracking/applications
        throw new Error('TODO: Implement pullCandidates');
    }

    async handleWebhook?(tenantId: string, event: any): Promise<void> {
        throw new Error('TODO: Implement handleWebhook');
    }
}

