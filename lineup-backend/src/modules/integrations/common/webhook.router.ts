/**
 * Webhook Router
 *
 * EXTENSION POINT: Routes incoming webhooks to appropriate provider handlers.
 * This is the entry point for all external webhook events.
 *
 * TODO: When implementing:
 * - Validate webhook signatures (provider-specific)
 * - Extract tenant identifier from payload
 * - Delegate to provider-specific handler
 * - Enqueue background jobs for processing
 */

/**
 * Webhook event structure (normalized from provider payloads)
 */
export interface WebhookEvent {
    /** Provider that sent the webhook */
    provider: string;
    /** Tenant ID (extracted from payload or signature) */
    tenantId: string;
    /** Event type (provider-specific, e.g., 'contact.created') */
    eventType: string;
    /** Raw payload from provider */
    payload: any;
    /** Timestamp when received */
    receivedAt: Date;
}

/**
 * Webhook handler interface
 *
 * TODO: Each provider should implement this to handle their webhook events
 */
export interface WebhookHandler {
    /**
     * Validate webhook authenticity
     *
     * TODO: Implementation should:
     * - Verify signature header (HMAC-SHA256 typically)
     * - Check timestamp for replay protection
     * - Return false for invalid webhooks
     *
     * Provider-specific validation:
     * - Salesforce: X-Salesforce-Signature header
     * - HubSpot: X-HubSpot-Signature header
     * - Zoho: Uses basic auth or API key in URL
     *
     * @param headers - Request headers
     * @param body - Raw request body
     * @param secret - Webhook secret for validation
     */
    validateSignature(headers: Record<string, string>, body: string, secret: string): boolean;

    /**
     * Extract tenant ID from webhook payload
     *
     * TODO: Implementation should:
     * - Parse provider-specific tenant identifier from payload
     * - Map external org ID to Lineup tenant ID (requires lookup)
     * - Handle missing tenant gracefully
     *
     * Provider-specific extraction:
     * - Salesforce: organizationId field
     * - HubSpot: portalId field
     * - Zoho: organization_id field
     * - Google Calendar: channelId (encoded with tenant)
     *
     * @param payload - Webhook payload
     */
    extractTenantId(payload: any): string | null;

    /**
     * Parse provider-specific event type
     *
     * TODO: Implementation should:
     * - Extract event type from payload
     * - Normalize to Lineup event types where applicable
     *
     * @param payload - Webhook payload
     */
    parseEventType(payload: any): string;

    /**
     * Process the webhook event
     *
     * TODO: Implementation should:
     * - Handle immediately if simple (< 5s processing)
     * - Enqueue to job queue if complex processing needed
     * - Return acknowledgment quickly to prevent retries
     *
     * @param tenantId - Tenant identifier
     * @param eventType - Parsed event type
     * @param payload - Full webhook payload
     */
    handleEvent(tenantId: string, eventType: string, payload: any): Promise<void>;
}

/**
 * Webhook Router Service
 *
 * TODO: Central routing service for all incoming webhooks
 */
export interface IWebhookRouter {
    /**
     * Route incoming webhook to appropriate handler
     *
     * TODO: Implementation should:
     * - Identify provider from URL path or payload
     * - Get appropriate handler for provider
     * - Validate webhook signature
     * - Extract tenant ID
     * - Delegate to handler
     *
     * Error handling:
     * - Invalid signature: Return 401, log attempt
     * - Unknown tenant: Return 200 (to stop retries), log warning
     * - Handler error: Return 500, allow retry
     *
     * @param provider - Provider identifier from URL
     * @param headers - Request headers
     * @param body - Raw request body
     */
    route(provider: string, headers: Record<string, string>, body: string): Promise<WebhookRouteResult>;

    /**
     * Register handler for a provider
     *
     * TODO: Called during module initialization to register provider handlers
     *
     * @param provider - Provider identifier
     * @param handler - Handler implementation
     */
    registerHandler(provider: string, handler: WebhookHandler): void;
}

/**
 * Result of routing a webhook
 */
export interface WebhookRouteResult {
    /** Whether webhook was successfully processed */
    success: boolean;
    /** HTTP status code to return */
    statusCode: number;
    /** Message for logging */
    message: string;
    /** Event that was processed (if successful) */
    event?: WebhookEvent;
}

// Export empty object to make this a module
export { };
