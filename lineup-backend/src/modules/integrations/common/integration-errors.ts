/**
 * Integration-specific error types
 * Domain-specific errors for external integrations
 */

/**
 * Thrown when OAuth authentication with a provider fails
 */
export class IntegrationAuthError extends Error {
    constructor(message: string = 'Integration authentication failed') {
        super(message);
        this.name = 'IntegrationAuthError';
    }
}

/**
 * Thrown when rate limit is exceeded on provider API
 */
export class IntegrationRateLimitError extends Error {
    constructor(message: string = 'Rate limit exceeded') {
        super(message);
        this.name = 'IntegrationRateLimitError';
    }
}

/**
 * Thrown when network communication with provider fails
 */
export class IntegrationNetworkError extends Error {
    constructor(message: string = 'Network error during integration call') {
        super(message);
        this.name = 'IntegrationNetworkError';
    }
}

/**
 * Thrown when data mapping between systems fails
 */
export class IntegrationMappingError extends Error {
    constructor(message: string = 'Failed to map data between systems') {
        super(message);
        this.name = 'IntegrationMappingError';
    }
}
