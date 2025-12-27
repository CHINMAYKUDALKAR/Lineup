/**
 * Provider Factory
 *
 * EXTENSION POINT: Main entry point for instantiating integration providers.
 * This is the top-level factory that should be used by controllers and services.
 *
 * TODO: Relationship with IntegrationFactory in ./common/:
 * - This file is the public-facing factory exposed to the rest of the application
 * - IntegrationFactory handles internal connector instantiation
 * - This factory adds higher-level concerns (capabilities, categories)
 *
 * TODO: When implementing:
 * - Import provider-specific modules as dependencies
 * - Register each provider with its OAuth, API, and Sync adapters
 * - Maintain provider status (ready/skeleton/deprecated)
 */

import { Injectable } from '@nestjs/common';
import type { IntegrationConnector, ProviderMetadata, ProviderCategory } from './common/integration.interface';

/**
 * Provider Capabilities
 *
 * TODO: Each provider should declare its capabilities:
 * - read: Can pull data from provider
 * - write: Can push data to provider
 * - bidirectional: Both read and write
 * - none: Capability not supported
 */
export type SyncCapability = 'read' | 'write' | 'bidirectional' | 'none';

/**
 * Provider capability declaration
 */
export interface ProviderCapabilities {
    /** Candidate/contact sync capability */
    candidateSync: SyncCapability;
    /** Job/requisition sync capability */
    jobSync: SyncCapability;
    /** Interview/calendar event sync capability */
    interviewSync: SyncCapability;
    /** Whether webhooks are supported for real-time updates */
    supportsWebhooks: boolean;
}

/**
 * Full provider definition including capabilities
 */
export interface ProviderDefinition extends ProviderMetadata {
    capabilities: ProviderCapabilities;
}

/**
 * Provider Factory Service
 *
 * TODO: This is the main factory service to inject and use throughout the app
 */
@Injectable()
export class ProviderFactory {
    /**
     * Registry of all known providers
     *
     * TODO: Populate with actual provider definitions when implementing
     *
     * Example entries:
     * ```
     * {
     *     name: 'salesforce',
     *     category: 'CRM',
     *     displayName: 'Salesforce',
     *     description: 'Sync leads and contacts with Salesforce CRM',
     *     status: 'ready',
     *     capabilities: {
     *         candidateSync: 'bidirectional',
     *         jobSync: 'none',
     *         interviewSync: 'none',
     *         supportsWebhooks: true,
     *     },
     * },
     * ```
     */
    private readonly providerRegistry: ProviderDefinition[] = [
        // TODO: CRM Providers
        // - salesforce
        // - hubspot
        // - zoho

        // TODO: ATS Providers
        // - lever
        // - greenhouse
        // - workday

        // TODO: HRIS Providers
        // - bamboohr

        // TODO: Calendar Providers
        // - google_calendar
        // - outlook_calendar
    ];

    /**
     * Get a connector instance for a provider
     *
     * TODO: Implementation should:
     * - Validate provider is supported and not deprecated
     * - Instantiate the appropriate connector with dependencies
     * - Return connector implementing IntegrationConnector interface
     * - Throw IntegrationNotFoundError if provider unknown
     *
     * @param provider - Provider identifier
     */
    getProvider(provider: string): IntegrationConnector {
        // TODO: Implement provider instantiation
        // switch (provider) {
        //     case 'salesforce':
        //         return new SalesforceConnector(...);
        //     case 'hubspot':
        //         return new HubspotConnector(...);
        //     default:
        //         throw new IntegrationNotFoundError(`Unknown provider: ${provider}`);
        // }
        throw new Error(`TODO: Implement getProvider for: ${provider}`);
    }

    /**
     * Get capabilities for a provider
     *
     * TODO: Return the capabilities declaration for a provider
     *
     * @param provider - Provider identifier
     */
    getCapabilities(provider: string): ProviderCapabilities | null {
        const definition = this.providerRegistry.find(p => p.name === provider);
        return definition?.capabilities ?? null;
    }

    /**
     * Get all supported providers
     *
     * @returns Array of provider definitions
     */
    getSupportedProviders(): ProviderDefinition[] {
        return this.providerRegistry.filter(p => p.status !== 'deprecated');
    }

    /**
     * Get providers by category
     *
     * @param category - Category to filter by
     */
    getProvidersByCategory(category: ProviderCategory): ProviderDefinition[] {
        return this.providerRegistry.filter(
            p => p.category === category && p.status !== 'deprecated'
        );
    }

    /**
     * Check if a provider is supported
     *
     * @param provider - Provider identifier
     */
    isSupported(provider: string): boolean {
        return this.providerRegistry.some(
            p => p.name === provider && p.status !== 'deprecated'
        );
    }

    /**
     * Get provider names as simple string array
     *
     * TODO: Useful for validation schemas
     */
    getProviderNames(): string[] {
        return this.providerRegistry
            .filter(p => p.status !== 'deprecated')
            .map(p => p.name);
    }

    /**
     * Get providers that support webhooks
     *
     * TODO: Useful for webhook registration UI
     */
    getWebhookEnabledProviders(): string[] {
        return this.providerRegistry
            .filter(p => p.capabilities?.supportsWebhooks && p.status === 'ready')
            .map(p => p.name);
    }
}
