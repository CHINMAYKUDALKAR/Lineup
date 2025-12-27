/**
 * Integration Base Service
 *
 * EXTENSION POINT: Abstract base class for provider-specific integration services.
 * Each provider should extend this class to inherit common functionality.
 *
 * TODO: When implementing concrete services:
 * - Call super() in constructor
 * - Implement all abstract methods
 * - Use base class helpers for common operations
 */
export abstract class IntegrationBaseService {
    /**
     * Provider identifier
     *
     * TODO: Each subclass must set this to its provider name
     */
    abstract readonly provider: string;

    /**
     * Get a valid access token for API calls
     *
     * TODO: Implementation should:
     * - Check token expiration from stored credentials
     * - Refresh token if near expiration (< 5 minutes)
     * - Return valid access token string
     * - Throw IntegrationAuthError if unable to get token
     *
     * Error handling expectations:
     * - IntegrationTokenExpiredError: Token cannot be refreshed, user must re-auth
     * - IntegrationNetworkError: Transient failure, can retry
     *
     * @param tenantId - Tenant identifier
     */
    abstract getAccessToken(tenantId: string): Promise<string>;

    /**
     * Refresh OAuth tokens
     *
     * TODO: Implementation should:
     * - Use refresh_token to obtain new access_token
     * - Update stored credentials with new tokens
     * - Handle refresh_token rotation if provider requires
     * - Update token expiration timestamp
     *
     * Retry expectations:
     * - 4xx errors: Do not retry, likely invalid refresh token
     * - 5xx errors: Retry with exponential backoff (max 3 attempts)
     * - Network errors: Retry with exponential backoff
     *
     * @param tenantId - Tenant identifier
     */
    abstract refreshToken(tenantId: string): Promise<void>;

    /**
     * Sync leads/candidates from external system
     *
     * TODO: Implementation should:
     * - Fetch records from provider's lead/candidate endpoint
     * - Apply field mapping transformations
     * - Upsert into Lineup candidates table
     * - Log each operation to IntegrationSyncLog
     * - Return summary of operations
     *
     * Error handling expectations:
     * - IntegrationRateLimitError: Back off and resume later
     * - IntegrationMappingError: Log and skip record, continue with others
     * - IntegrationNetworkError: Retry entire batch
     *
     * @param tenantId - Tenant identifier
     */
    abstract syncLeads(tenantId: string): Promise<any>;

    /**
     * Sync contacts from external system
     *
     * TODO: Implementation should:
     * - Fetch records from provider's contact endpoint
     * - Apply field mapping transformations
     * - Upsert into Lineup candidates table
     * - Log each operation to IntegrationSyncLog
     *
     * @param tenantId - Tenant identifier
     */
    abstract syncContacts(tenantId: string): Promise<any>;

    // ============================================
    // Base class helpers (to be implemented)
    // ============================================

    /**
     * Log sync operation to audit trail
     *
     * TODO: Helper method for subclasses to log sync operations
     * Should create IntegrationSyncLog records
     *
     * @param tenantId - Tenant identifier
     * @param entityType - Type of entity (CANDIDATE, JOB, INTERVIEW)
     * @param operation - Operation type (CREATE, UPDATE, DELETE)
     * @param externalId - External system ID
     * @param internalId - Lineup internal ID
     * @param status - Operation status (SUCCESS, FAILED)
     * @param error - Error message if failed
     */
    protected logSyncOperation(
        tenantId: string,
        entityType: string,
        operation: string,
        externalId: string,
        internalId: string,
        status: 'SUCCESS' | 'FAILED',
        error?: string,
    ): void {
        // TODO: Implement sync logging
        // Should use PrismaService to create IntegrationSyncLog record
    }

    /**
     * Check if integration is connected
     *
     * TODO: Helper to verify integration has valid credentials
     *
     * @param tenantId - Tenant identifier
     */
    protected async isConnected(tenantId: string): Promise<boolean> {
        // TODO: Check integration status in database
        return false;
    }

    /**
     * Handle common API errors
     *
     * TODO: Transform HTTP errors to domain errors:
     * - 401/403 -> IntegrationAuthError
     * - 429 -> IntegrationRateLimitError
     * - 5xx -> IntegrationNetworkError
     * - Mapping failures -> IntegrationMappingError
     *
     * @param error - Original error
     * @param context - Operation context for error message
     */
    protected handleApiError(error: any, context: string): never {
        // TODO: Implement error transformation
        throw error;
    }
}
