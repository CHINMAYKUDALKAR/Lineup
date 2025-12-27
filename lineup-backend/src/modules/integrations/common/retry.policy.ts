/**
 * Retry Policy Framework
 *
 * EXTENSION POINT: Defines retry behavior for integration operations.
 * Used by queue processors and API adapters to handle transient failures.
 *
 * TODO: When implementing actual retry logic:
 * - Use Bull/BullMQ's built-in retry with these policies
 * - Implement circuit breaker for repeated failures
 * - Track retry metrics per provider
 */

import {
    IntegrationError,
    IntegrationRateLimitError,
    IntegrationNetworkError,
    IntegrationTokenExpiredError,
} from './integration-errors';

/**
 * Retry configuration for a specific error type
 */
export interface RetryConfig {
    /** Maximum number of retry attempts */
    maxAttempts: number;
    /** Initial delay in milliseconds */
    initialDelayMs: number;
    /** Maximum delay between retries in milliseconds */
    maxDelayMs: number;
    /** Backoff multiplier (2.0 for exponential doubling) */
    backoffMultiplier: number;
    /** Whether to add jitter to prevent thundering herd */
    useJitter: boolean;
}

/**
 * Default retry configurations by error type
 *
 * TODO: These should be used when configuring BullMQ job options
 *
 * Example usage with BullMQ:
 * ```
 * await queue.add('sync', data, {
 *     attempts: retryPolicy.maxAttempts,
 *     backoff: {
 *         type: 'exponential',
 *         delay: retryPolicy.initialDelayMs,
 *     },
 * });
 * ```
 */
export const DEFAULT_RETRY_POLICIES: Record<string, RetryConfig> = {
    /**
     * Network errors: Aggressive retry with exponential backoff
     * Use case: Connection timeouts, DNS failures, transient network issues
     */
    NETWORK_ERROR: {
        maxAttempts: 5,
        initialDelayMs: 1000,
        maxDelayMs: 60000,
        backoffMultiplier: 2.0,
        useJitter: true,
    },

    /**
     * Rate limit errors: Respect provider limits with longer delays
     * Use case: 429 Too Many Requests responses
     * TODO: If Retry-After header is present, use that value instead
     */
    RATE_LIMIT: {
        maxAttempts: 10,
        initialDelayMs: 30000,
        maxDelayMs: 3600000, // 1 hour max
        backoffMultiplier: 2.0,
        useJitter: true,
    },

    /**
     * Token expired: Single retry after token refresh
     * Use case: Access token expired, refresh attempted
     */
    TOKEN_EXPIRED: {
        maxAttempts: 2,
        initialDelayMs: 1000,
        maxDelayMs: 5000,
        backoffMultiplier: 1.5,
        useJitter: false,
    },

    /**
     * Provider errors (5xx): Moderate retry with backoff
     * Use case: Provider server errors, temporary outages
     */
    PROVIDER_ERROR: {
        maxAttempts: 3,
        initialDelayMs: 5000,
        maxDelayMs: 60000,
        backoffMultiplier: 2.0,
        useJitter: true,
    },
};

/**
 * Retry Policy Interface
 *
 * TODO: Implement this interface for custom retry behavior
 */
export interface IRetryPolicy {
    /**
     * Determine if an error should be retried
     *
     * @param error - The error that occurred
     * @param attemptNumber - Current attempt number (1-based)
     * @returns Whether to retry
     */
    shouldRetry(error: Error, attemptNumber: number): boolean;

    /**
     * Calculate delay before next retry
     *
     * @param error - The error that occurred
     * @param attemptNumber - Current attempt number
     * @returns Delay in milliseconds
     */
    getRetryDelay(error: Error, attemptNumber: number): number;
}

/**
 * Get retry policy for a given error
 *
 * TODO: Map error types to retry policies
 *
 * @param error - Error to get policy for
 * @returns Appropriate retry configuration
 */
export function getRetryPolicyForError(error: Error): RetryConfig | null {
    // No retry for non-integration errors
    if (!(error instanceof IntegrationError)) {
        return null;
    }

    // No retry for non-retryable errors
    if (!error.retryable) {
        return null;
    }

    // Map to specific policies
    if (error instanceof IntegrationRateLimitError) {
        return DEFAULT_RETRY_POLICIES.RATE_LIMIT;
    }

    if (error instanceof IntegrationNetworkError) {
        return DEFAULT_RETRY_POLICIES.NETWORK_ERROR;
    }

    if (error instanceof IntegrationTokenExpiredError) {
        return DEFAULT_RETRY_POLICIES.TOKEN_EXPIRED;
    }

    // Default for other retryable errors
    return DEFAULT_RETRY_POLICIES.PROVIDER_ERROR;
}

/**
 * Calculate retry delay with optional jitter
 *
 * TODO: Use this in retry implementations
 *
 * @param policy - Retry configuration
 * @param attemptNumber - Current attempt (1-based)
 * @returns Delay in milliseconds
 */
export function calculateRetryDelay(policy: RetryConfig, attemptNumber: number): number {
    // Calculate base delay with exponential backoff
    const baseDelay = Math.min(
        policy.initialDelayMs * Math.pow(policy.backoffMultiplier, attemptNumber - 1),
        policy.maxDelayMs
    );

    // Add jitter if configured (±25% variance)
    if (policy.useJitter) {
        const jitterRange = baseDelay * 0.25;
        const jitter = Math.random() * jitterRange * 2 - jitterRange;
        return Math.max(0, Math.floor(baseDelay + jitter));
    }

    return Math.floor(baseDelay);
}

/**
 * Circuit Breaker State
 *
 * TODO: Implement circuit breaker pattern per provider
 * - CLOSED: Normal operation, requests flow through
 * - OPEN: Failing fast, no requests sent to provider
 * - HALF_OPEN: Testing if provider has recovered
 */
export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

/**
 * Circuit Breaker Configuration
 *
 * TODO: Implement to prevent overwhelming failing providers
 */
export interface CircuitBreakerConfig {
    /** Number of failures before opening circuit */
    failureThreshold: number;
    /** Time in ms before attempting to close circuit */
    resetTimeoutMs: number;
    /** Number of successful calls in half-open state to close circuit */
    successThreshold: number;
}

/**
 * Default circuit breaker configuration
 *
 * TODO: Use per-provider circuit breakers in ProviderFactory
 */
export const DEFAULT_CIRCUIT_BREAKER: CircuitBreakerConfig = {
    failureThreshold: 5,
    resetTimeoutMs: 60000,
    successThreshold: 3,
};
