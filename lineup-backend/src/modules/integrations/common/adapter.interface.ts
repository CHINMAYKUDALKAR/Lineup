/**
 * Integration Adapter Interface
 *
 * EXTENSION POINT: Base adapter structure for implementing external service integrations.
 * Each provider (Salesforce, HubSpot, etc.) should have adapters implementing these interfaces.
 *
 * The adapter pattern separates concerns:
 * - OAuthAdapter: Authentication flow
 * - ApiAdapter: HTTP communication
 * - SyncAdapter: Data synchronization logic
 */

/**
 * OAuth Adapter Interface
 *
 * TODO: Responsibilities for implementers:
 * - Generate authorization URLs with proper scopes
 * - Exchange authorization codes for tokens
 * - Securely store tokens (use TokenStoreService)
 * - Implement token refresh before expiration
 * - Handle provider-specific OAuth quirks (e.g., Salesforce instance URLs)
 */
export interface OAuthAdapter {
    /**
     * Get the OAuth authorization URL
     *
     * TODO: Implementation should:
     * - Include required scopes for the integration
     * - Encode state parameter with tenant ID
     * - Use environment-specific redirect URIs
     *
     * @param tenantId - Tenant identifier to encode in state
     * @returns Full authorization URL to redirect user to
     */
    getAuthorizationUrl(tenantId: string): Promise<string>;

    /**
     * Exchange authorization code for tokens
     *
     * TODO: Implementation should:
     * - Make token exchange request to provider
     * - Store access_token and refresh_token securely
     * - Record token expiration time
     * - Update integration status to 'connected'
     *
     * @param tenantId - Tenant identifier
     * @param code - Authorization code from callback
     */
    exchangeCode(tenantId: string, code: string): Promise<void>;

    /**
     * Refresh expired access token
     *
     * TODO: Implementation should:
     * - Check if refresh is actually needed
     * - Handle refresh token rotation
     * - Update stored tokens
     * - Emit IntegrationAuthError if refresh fails
     *
     * @param tenantId - Tenant identifier
     */
    refreshTokens(tenantId: string): Promise<void>;

    /**
     * Revoke tokens and disconnect
     *
     * TODO: Implementation should:
     * - Call provider's token revocation endpoint
     * - Clear stored tokens
     * - Update integration status to 'disconnected'
     *
     * @param tenantId - Tenant identifier
     */
    revokeTokens?(tenantId: string): Promise<void>;
}

/**
 * API Adapter Interface
 *
 * TODO: Responsibilities for implementers:
 * - Handle HTTP requests to provider APIs
 * - Implement request signing/authentication
 * - Handle rate limiting with exponential backoff
 * - Transform HTTP errors to domain errors
 * - Log API calls for debugging
 */
export interface ApiAdapter {
    /**
     * Make authenticated GET request
     *
     * TODO: Implementation should:
     * - Attach authorization headers
     * - Handle pagination automatically
     * - Retry on transient failures
     * - Throw IntegrationNetworkError on connection issues
     * - Throw IntegrationRateLimitError when rate limited
     *
     * @param tenantId - Tenant identifier for auth context
     * @param endpoint - API endpoint path
     * @param params - Query parameters
     */
    get<T>(tenantId: string, endpoint: string, params?: Record<string, any>): Promise<T>;

    /**
     * Make authenticated POST request
     *
     * TODO: Implementation should:
     * - Serialize body appropriately (JSON, form-data)
     * - Handle provider-specific content types
     * - Return created resource with external ID
     *
     * @param tenantId - Tenant identifier
     * @param endpoint - API endpoint path
     * @param body - Request body
     */
    post<T>(tenantId: string, endpoint: string, body: any): Promise<T>;

    /**
     * Make authenticated PATCH/PUT request
     *
     * TODO: Implementation differs by provider:
     * - Some use PATCH for partial updates
     * - Some use PUT for full replacement
     * - Check provider documentation
     *
     * @param tenantId - Tenant identifier
     * @param endpoint - API endpoint path
     * @param body - Request body
     */
    update<T>(tenantId: string, endpoint: string, body: any): Promise<T>;

    /**
     * Make authenticated DELETE request
     *
     * @param tenantId - Tenant identifier
     * @param endpoint - API endpoint path
     */
    delete(tenantId: string, endpoint: string): Promise<void>;
}

/**
 * Sync Adapter Interface
 *
 * TODO: Responsibilities for implementers:
 * - Coordinate data synchronization between systems
 * - Transform data using field mappings
 * - Handle conflict resolution
 * - Log sync operations for audit trail
 * - Emit events for real-time updates
 */
export interface SyncAdapter {
    /**
     * Sync candidates from external system to Lineup
     *
     * TODO: Implementation should:
     * - Fetch candidates modified since last sync
     * - Apply field mapping transformations
     * - Match to existing Lineup records by external ID
     * - Create or update as appropriate
     * - Log each sync operation to IntegrationSyncLog
     *
     * @param tenantId - Tenant identifier
     * @param options - Sync options (since date, module filter, etc.)
     */
    syncCandidatesInbound(tenantId: string, options?: SyncOptions): Promise<SyncSummary>;

    /**
     * Sync candidates from Lineup to external system
     *
     * TODO: Implementation should:
     * - Fetch Lineup candidates needing sync
     * - Apply reverse field mappings
     * - Push to external system
     * - Store returned external IDs
     *
     * @param tenantId - Tenant identifier
     * @param options - Sync options
     */
    syncCandidatesOutbound?(tenantId: string, options?: SyncOptions): Promise<SyncSummary>;

    /**
     * Handle incoming webhook event
     *
     * TODO: Implementation should:
     * - Parse provider-specific event format
     * - Determine entity type and operation
     * - Enqueue sync job or process immediately
     * - Acknowledge webhook promptly (< 5s)
     *
     * @param tenantId - Tenant identifier
     * @param event - Webhook event payload
     */
    handleWebhookEvent?(tenantId: string, event: any): Promise<void>;
}

/**
 * Sync options for adapter operations
 */
export interface SyncOptions {
    /** Sync records modified since this date */
    since?: Date;
    /** Module filter (e.g., 'Leads', 'Contacts') */
    module?: string;
    /** Maximum records to process */
    limit?: number;
    /** Whether to do full sync vs incremental */
    fullSync?: boolean;
}

/**
 * Summary of sync operation results
 */
export interface SyncSummary {
    /** Total records processed */
    total: number;
    /** Records created */
    created: number;
    /** Records updated */
    updated: number;
    /** Records that failed */
    failed: number;
    /** Error details for failures */
    errors?: Array<{ recordId: string; error: string }>;
}
