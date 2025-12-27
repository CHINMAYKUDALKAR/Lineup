import { Injectable } from '@nestjs/common';
import { IntegrationConnector, ProviderMetadata, ProviderCategory } from './integration.interface';

/**
 * Integration Factory
 *
 * EXTENSION POINT: Central registry for all integration providers.
 * This factory manages provider instantiation and capability declaration.
 *
 * TODO: When implementing:
 * - Inject provider-specific dependencies (OAuth services, API clients)
 * - Register each provider in the switch statement
 * - Keep supported providers list updated
 */
@Injectable()
export class IntegrationFactory {
  /**
   * Provider registry
   *
   * TODO: Populate with actual provider metadata when implementing:
   * - Add each supported provider with accurate capabilities
   * - Update status as providers move from skeleton to ready
   */
  private readonly providers: ProviderMetadata[] = [
    // CRM Providers
    // TODO: { name: 'salesforce', category: 'CRM', displayName: 'Salesforce', description: 'Sync leads and contacts with Salesforce', status: 'skeleton' },
    // TODO: { name: 'hubspot', category: 'CRM', displayName: 'HubSpot', description: 'Sync contacts and deals with HubSpot CRM', status: 'skeleton' },
    // TODO: { name: 'zoho', category: 'CRM', displayName: 'Zoho CRM', description: 'Sync leads and contacts with Zoho CRM', status: 'skeleton' },

    // ATS Providers
    // TODO: { name: 'lever', category: 'ATS', displayName: 'Lever', description: 'Sync candidates and jobs with Lever ATS', status: 'skeleton' },
    // TODO: { name: 'greenhouse', category: 'ATS', displayName: 'Greenhouse', description: 'Sync candidates with Greenhouse ATS', status: 'skeleton' },
    // TODO: { name: 'workday', category: 'ATS', displayName: 'Workday', description: 'Sync with Workday Recruiting', status: 'skeleton' },

    // HRIS Providers
    // TODO: { name: 'bamboohr', category: 'HRIS', displayName: 'BambooHR', description: 'Sync employee data with BambooHR', status: 'skeleton' },

    // Calendar Providers
    // TODO: { name: 'google_calendar', category: 'Calendar', displayName: 'Google Calendar', description: 'Sync interview events with Google Calendar', status: 'skeleton' },
    // TODO: { name: 'outlook_calendar', category: 'Calendar', displayName: 'Outlook Calendar', description: 'Sync interview events with Outlook', status: 'skeleton' },
  ];

  /**
   * Get connector instance by provider name
   *
   * TODO: Implementation should:
   * - Validate provider is supported
   * - Instantiate provider-specific connector
   * - Inject required dependencies (PrismaService, ConfigService, etc.)
   * - Return connector implementing IntegrationConnector interface
   *
   * Example implementation pattern:
   * ```
   * switch (provider) {
   *     case 'salesforce':
   *         return new SalesforceConnector(this.salesforceOAuth, this.salesforceApi);
   *     case 'hubspot':
   *         return new HubspotConnector(this.hubspotOAuth, this.hubspotApi);
   *     default:
   *         throw new Error(`Unknown provider: ${provider}`);
   * }
   * ```
   *
   * @param provider - Provider identifier (e.g., 'salesforce', 'hubspot')
   * @throws Error if provider is not supported
   */
  getConnector(provider: string): IntegrationConnector {
    // TODO: Implement provider switch logic
    // Each case should return a connector implementing IntegrationConnector
    throw new Error(`TODO: Implement getConnector for provider: ${provider}`);
  }

  /**
   * Get list of all supported providers
   *
   * TODO: Return actual provider metadata once providers are implemented
   *
   * @returns Array of provider metadata objects
   */
  getSupportedProviders(): ProviderMetadata[] {
    // TODO: Return this.providers when populated
    return [];
  }

  /**
   * Get providers filtered by category
   *
   * TODO: Implementation should filter providers array by category
   *
   * @param category - Provider category to filter by
   */
  getProvidersByCategory(category: ProviderCategory): ProviderMetadata[] {
    // TODO: Implement filtering
    // return this.providers.filter(p => p.category === category);
    return [];
  }

  /**
   * Check if a provider is supported
   *
   * @param provider - Provider identifier to check
   */
  isSupported(provider: string): boolean {
    // TODO: Check against actual provider list
    // return this.providers.some(p => p.name === provider && p.status !== 'deprecated');
    return false;
  }

  /**
   * Get provider names as simple array
   *
   * TODO: Used for validation and dropdown population
   */
  getProviderNames(): string[] {
    // TODO: return this.providers.map(p => p.name);
    return [];
  }
}
