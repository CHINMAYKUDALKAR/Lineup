/**
 * TODO: Rate Limit Types
 * 
 * Define TypeScript interfaces for rate limiting.
 */

export interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset: number; // Unix timestamp
}

export interface RateLimitResult {
    success: boolean;
    info: RateLimitInfo;
    blocked: boolean;
    retryAfter?: number;
}

export interface RateLimitKey {
    tenantId: string;
    ip: string;
    route: string;
}

export interface RateLimitRecord {
    count: number;
    firstRequest: number; // Unix timestamp
    windowStart: number;
}
