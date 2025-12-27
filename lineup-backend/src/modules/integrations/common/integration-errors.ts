/**
 * Integration Error Classes
 *
 * EXTENSION POINT: Hierarchy of domain-specific errors for integrations.
 * These errors communicate what went wrong and what retry behavior is expected.
 *
 * TODO: Error handling patterns:
 * - IntegrationAuthError: No automatic retry, require user re-authentication
 * - IntegrationTokenExpiredError: Attempt token refresh, then retry once
 * - IntegrationRateLimitError: Exponential backoff with jitter
 * - IntegrationNetworkError: Retry with exponential backoff (max 5 attempts)
 * - IntegrationMappingError: Log and skip record, no retry
 * - IntegrationProviderError: Provider-specific handling
 */

/**
 * Base class for all integration errors
 *
 * TODO: All integration errors should extend this base class
 */
export abstract class IntegrationError extends Error {
    /** Whether this error can be retried */
    abstract readonly retryable: boolean;
    /** Provider that caused the error (if known) */
    provider?: string;
    /** Tenant context (if known) */
    tenantId?: string;

    constructor(message: string) {
        super(message);
        this.name = 'IntegrationError';
    }
}

/**
 * Thrown when OAuth authentication with a provider fails
 *
 * Retry expectation: NO RETRY
 * User action required: Must re-authenticate via OAuth flow
 */
export class IntegrationAuthError extends IntegrationError {
    readonly retryable = false;

    constructor(message: string = 'Integration authentication failed') {
        super(message);
        this.name = 'IntegrationAuthError';
    }
}

/**
 * Thrown when access token is expired and refresh fails
 *
 * Retry expectation: ATTEMPT REFRESH ONCE
 * If refresh fails, treat as IntegrationAuthError
 */
export class IntegrationTokenExpiredError extends IntegrationError {
    readonly retryable = true;

    constructor(message: string = 'Access token expired and refresh failed') {
        super(message);
        this.name = 'IntegrationTokenExpiredError';
    }
}

/**
 * Thrown when rate limit is exceeded on provider API
 *
 * Retry expectation: RETRY WITH BACKOFF
 * TODO: Implementation should:
 * - Parse Retry-After header if provided
 * - Use exponential backoff with jitter
 * - Max retry duration: 1 hour
 */
export class IntegrationRateLimitError extends IntegrationError {
    readonly retryable = true;
    /** Suggested wait time in milliseconds (from Retry-After header) */
    retryAfterMs?: number;

    constructor(message: string = 'Rate limit exceeded', retryAfterMs?: number) {
        super(message);
        this.name = 'IntegrationRateLimitError';
        this.retryAfterMs = retryAfterMs;
    }
}

/**
 * Thrown when network communication with provider fails
 *
 * Retry expectation: RETRY WITH EXPONENTIAL BACKOFF
 * TODO: Max 5 retry attempts with delays: 1s, 2s, 4s, 8s, 16s
 */
export class IntegrationNetworkError extends IntegrationError {
    readonly retryable = true;
    /** Original error code (e.g., ECONNREFUSED, ETIMEDOUT) */
    errorCode?: string;

    constructor(message: string = 'Network error during integration call', errorCode?: string) {
        super(message);
        this.name = 'IntegrationNetworkError';
        this.errorCode = errorCode;
    }
}

/**
 * Thrown when data mapping between systems fails
 *
 * Retry expectation: NO RETRY (data issue, not transient)
 * TODO: Log record details for debugging, skip and continue with other records
 */
export class IntegrationMappingError extends IntegrationError {
    readonly retryable = false;
    /** Field that failed mapping */
    field?: string;
    /** Source value that couldn't be mapped */
    sourceValue?: any;

    constructor(message: string = 'Failed to map data between systems', field?: string) {
        super(message);
        this.name = 'IntegrationMappingError';
        this.field = field;
    }
}

/**
 * Thrown for provider-specific errors not covered by other types
 *
 * Retry expectation: DEPENDS ON ERROR CODE
 * TODO: Parse provider error response and determine retry strategy:
 * - 4xx client errors: Usually no retry
 * - 5xx server errors: Retry with backoff
 */
export class IntegrationProviderError extends IntegrationError {
    readonly retryable: boolean;
    /** Provider-specific error code */
    providerErrorCode?: string;
    /** HTTP status code if from API response */
    httpStatus?: number;

    constructor(
        message: string = 'Provider returned an error',
        options?: { retryable?: boolean; providerErrorCode?: string; httpStatus?: number }
    ) {
        super(message);
        this.name = 'IntegrationProviderError';
        this.retryable = options?.retryable ?? false;
        this.providerErrorCode = options?.providerErrorCode;
        this.httpStatus = options?.httpStatus;
    }
}

/**
 * Thrown when webhook signature validation fails
 *
 * Retry expectation: NO RETRY (invalid request)
 * Security: Log the attempt with source IP
 */
export class IntegrationWebhookValidationError extends IntegrationError {
    readonly retryable = false;

    constructor(message: string = 'Webhook signature validation failed') {
        super(message);
        this.name = 'IntegrationWebhookValidationError';
    }
}

/**
 * Thrown when a provider is not configured or not found
 *
 * Retry expectation: NO RETRY (configuration issue)
 */
export class IntegrationNotFoundError extends IntegrationError {
    readonly retryable = false;

    constructor(message: string = 'Integration not found or not configured') {
        super(message);
        this.name = 'IntegrationNotFoundError';
    }
}
