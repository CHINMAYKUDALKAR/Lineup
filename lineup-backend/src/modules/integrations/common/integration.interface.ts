/**
 * Integration Connector Interface
 *
 * EXTENSION POINT: This is the primary interface for connecting to external services.
 * New integration providers must implement this interface.
 *
 * TODO: Responsibilities for implementers:
 * - Implement OAuth 2.0 flow (authorization code grant)
 * - Handle token storage and refresh lifecycle
 * - Transform data between Lineup and provider formats
 * - Implement rate limiting awareness
 * - Handle provider-specific error codes
 */
export interface IntegrationConnector {
    /**
     * Provider identifier (e.g., 'salesforce', 'hubspot', 'zoho')
     */
    provider: string;

    /**
     * Initialize the connector for a tenant
     *
     * TODO: Implementation should:
     * - Load stored credentials for the tenant
     * - Validate token expiration
     * - Prepare any provider-specific configurations
     *
     * @param tenantId - The tenant's unique identifier
     */
    init(tenantId: string): Promise<void>;

    /**
     * Retrieve valid access token for API calls
     *
     * TODO: Implementation should:
     * - Return cached token if still valid
     * - Trigger refresh if token is near expiration
     * - Throw IntegrationAuthError if unable to obtain token
     *
     * @param tenantId - The tenant's unique identifier
     * @returns Valid access token string
     */
    getAccessToken(tenantId: string): Promise<string>;

    /**
     * Refresh the OAuth tokens
     *
     * TODO: Implementation should:
     * - Use refresh_token to obtain new access_token
     * - Store updated tokens securely (encrypted)
     * - Handle refresh_token rotation if provider requires it
     * - Throw IntegrationAuthError if refresh fails (user must re-authenticate)
     *
     * @param tenantId - The tenant's unique identifier
     */
    refreshToken(tenantId: string): Promise<void>;

    /**
     * Push a record to the external system
     *
     * TODO: Implementation should:
     * - Transform Lineup record to provider format
     * - Handle create vs update based on external ID presence
     * - Return sync result with external ID
     * - Throw IntegrationMappingError for transformation failures
     *
     * @param tenantId - The tenant's unique identifier
     * @param record - The record to push (candidate, job, etc.)
     * @returns Sync result with external system response
     */
    pushRecord(tenantId: string, record: any): Promise<any>;

    /**
     * Pull changes from the external system
     *
     * TODO: Implementation should:
     * - Query provider API for records modified since timestamp
     * - Transform provider records to Lineup format
     * - Implement pagination for large result sets
     * - Handle rate limiting with appropriate backoff
     *
     * @param tenantId - The tenant's unique identifier
     * @param since - Optional ISO timestamp to fetch changes since
     * @returns Array of transformed records
     */
    pullChanges(tenantId: string, since?: string): Promise<any[]>;

    /**
     * Handle incoming webhook from the provider (optional)
     *
     * TODO: Implementation should:
     * - Validate webhook signature/authenticity
     * - Parse provider-specific event format
     * - Enqueue appropriate sync jobs
     * - Return acknowledgment response
     *
     * @param tenantId - The tenant's unique identifier
     * @param payload - Raw webhook payload from provider
     * @returns Acknowledgment or processed result
     */
    handleWebhook?(tenantId: string, payload: any): Promise<any>;
}

/**
 * Provider Category
 *
 * TODO: When adding new providers, categorize appropriately:
 * - CRM: Salesforce, HubSpot, Zoho CRM
 * - ATS: Lever, Greenhouse, Workday Recruiting
 * - HRIS: BambooHR, Workday HCM
 * - Calendar: Google Calendar, Outlook Calendar
 */
export type ProviderCategory = 'CRM' | 'ATS' | 'HRIS' | 'Calendar';

/**
 * Provider Registration Metadata
 *
 * TODO: Used by ProviderFactory to manage available integrations
 */
export interface ProviderMetadata {
    name: string;
    category: ProviderCategory;
    displayName: string;
    description: string;
    iconUrl?: string;
    /** Whether this provider is fully implemented or just scaffolded */
    status: 'ready' | 'skeleton' | 'deprecated';
}
