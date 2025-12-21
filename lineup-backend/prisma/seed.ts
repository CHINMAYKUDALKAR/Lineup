import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * TODO: Database Seed Script
 * 
 * Populate the database with initial data for development/testing.
 * 
 * Expected seed data:
 * - Default tenant for development
 * - Admin user for testing
 * - Sample hiring stages
 * - Sample interview types
 */
async function main() {
    // TODO: Create default development tenant
    // - name: "Development Tenant"
    // - trialActive: true

    // TODO: Create admin user
    // - email: admin@example.com
    // - role: ADMIN
    // - hash password with bcrypt

    // TODO: Create default hiring stages
    // - Applied, Screening, Interview, Offer, Hired

    // TODO: Create sample interview types
    // - Phone Screen, Technical, Culture Fit, Final

    console.log('TODO: Implement database seeding');
    throw new Error('TODO: Implement seed script');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
