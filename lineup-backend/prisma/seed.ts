import { PrismaClient, Role, UserStatus, Channel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Database Seed Script
 * 
 * Populates the database with initial data for development/testing.
 */
async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create default development tenant
  console.log('📦 Creating default tenant...');
  const tenant = await prisma.tenant.upsert({
    where: { id: 'dev-tenant-1' },
    update: {},
    create: {
      id: 'dev-tenant-1',
      name: 'Development Tenant',
      domain: 'dev.lineup.local',
      subdomain: 'dev',
      trialActive: true,
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      plan: 'TRIAL',
      isActive: true,
    },
  });
  console.log(`✅ Created tenant: ${tenant.name}`);

  // 2. Create tenant settings
  console.log('⚙️  Creating tenant settings...');
  await prisma.tenantSettings.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      tenantId: tenant.id,
      settings: {
        allowPublicSignup: false,
        requireEmailVerification: true,
        defaultUserRole: 'RECRUITER',
      },
      emailConfig: {
        fromEmail: 'noreply@lineup.local',
        fromName: 'Lineup',
      },
      branding: {
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
      },
      notifications: {
        email: true,
        sms: false,
        whatsapp: false,
      },
    },
  });
  console.log('✅ Tenant settings created');

  // 3. Create admin user
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'admin@example.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      activeTenantId: tenant.id,
    },
  });
  console.log(`✅ Created admin user: ${adminUser.email}`);

  // 4. Create manager user
  console.log('👤 Creating manager user...');
  const managerPassword = await bcrypt.hash('manager123', 10);
  const managerUser = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'manager@example.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'manager@example.com',
      password: managerPassword,
      name: 'Manager User',
      role: Role.MANAGER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      activeTenantId: tenant.id,
    },
  });
  console.log(`✅ Created manager user: ${managerUser.email}`);

  // 5. Create recruiter user
  console.log('👤 Creating recruiter user...');
  const recruiterPassword = await bcrypt.hash('recruiter123', 10);
  const recruiterUser = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'recruiter@example.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'recruiter@example.com',
      password: recruiterPassword,
      name: 'Recruiter User',
      role: Role.RECRUITER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      activeTenantId: tenant.id,
    },
  });
  console.log(`✅ Created recruiter user: ${recruiterUser.email}`);

  // 6. Create sample candidates
  console.log('👥 Creating sample candidates...');
  const candidates = [
    {
      tenantId: tenant.id,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      source: 'LinkedIn',
      stage: 'APPLIED',
      rating: 4,
      notes: 'Strong candidate with 5 years of experience',
      tags: ['senior', 'fullstack', 'react'],
    },
    {
      tenantId: tenant.id,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1234567891',
      source: 'Referral',
      stage: 'SCREENING',
      rating: 5,
      notes: 'Excellent communication skills',
      tags: ['junior', 'frontend', 'vue'],
    },
    {
      tenantId: tenant.id,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '+1234567892',
      source: 'Job Board',
      stage: 'INTERVIEW',
      rating: 3,
      notes: 'Good technical skills, needs improvement in soft skills',
      tags: ['mid-level', 'backend', 'nodejs'],
    },
  ];

  for (const candidateData of candidates) {
    const candidate = await prisma.candidate.create({
      data: candidateData,
    });
    console.log(`✅ Created candidate: ${candidate.name}`);
  }

  // 7. Create sample interviews
  console.log('📅 Creating sample interviews...');
  const createdCandidates = await prisma.candidate.findMany({
    where: { tenantId: tenant.id },
    take: 2,
  });

  if (createdCandidates.length >= 2) {
    const interview1 = await prisma.interview.create({
      data: {
        tenantId: tenant.id,
        candidateId: createdCandidates[0].id,
        title: 'Technical Interview',
        description: 'First round technical assessment',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        durationMins: 60,
        status: 'SCHEDULED',
        meetingLink: 'https://meet.example.com/interview-1',
      },
    });

    // Add interviewers
    await prisma.interviewInterviewer.createMany({
      data: [
        {
          interviewId: interview1.id,
          userId: managerUser.id,
        },
        {
          interviewId: interview1.id,
          userId: recruiterUser.id,
        },
      ],
    });

    console.log(`✅ Created interview: ${interview1.title}`);

    const interview2 = await prisma.interview.create({
      data: {
        tenantId: tenant.id,
        candidateId: createdCandidates[1].id,
        title: 'Culture Fit Interview',
        description: 'Cultural alignment assessment',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        durationMins: 45,
        status: 'SCHEDULED',
      },
    });

    await prisma.interviewInterviewer.create({
      data: {
        interviewId: interview2.id,
        userId: adminUser.id,
      },
    });

    console.log(`✅ Created interview: ${interview2.title}`);
  }

  // 8. Create sample team
  console.log('👥 Creating sample team...');
  const team = await prisma.team.create({
    data: {
      tenantId: tenant.id,
      name: 'Engineering Team',
      description: 'Software engineering and development team',
    },
  });

  await prisma.teamMember.createMany({
    data: [
      {
        teamId: team.id,
        userId: managerUser.id,
        role: 'LEADER',
      },
      {
        teamId: team.id,
        userId: recruiterUser.id,
        role: 'MEMBER',
      },
    ],
  });
  console.log(`✅ Created team: ${team.name}`);

  // 9. Create working hours for users
  console.log('⏰ Creating working hours...');
  const workingDays = [1, 2, 3, 4, 5]; // Monday to Friday
  for (const userId of [adminUser.id, managerUser.id, recruiterUser.id]) {
    for (const dayOfWeek of workingDays) {
      await prisma.workingHours.create({
        data: {
          userId,
          dayOfWeek,
          startTime: '09:00',
          endTime: '17:00',
          timezone: 'UTC',
          isActive: true,
        },
      });
    }
  }
  console.log('✅ Working hours created');

  // 10. Create message templates
  console.log('📧 Creating message templates...');
  const templates = [
    {
      tenantId: tenant.id,
      name: 'Interview Invitation',
      channel: Channel.EMAIL,
      subject: 'Interview Invitation - {{candidateName}}',
      body: 'Hi {{candidateName}},\n\nYou have been invited for an interview on {{interviewDate}}.\n\nBest regards,\n{{companyName}}',
      variables: ['candidateName', 'interviewDate', 'companyName'],
      isActive: true,
    },
    {
      tenantId: tenant.id,
      name: 'Interview Reminder',
      channel: Channel.EMAIL,
      subject: 'Reminder: Interview Tomorrow',
      body: 'Hi {{candidateName}},\n\nThis is a reminder that you have an interview scheduled for tomorrow at {{interviewTime}}.\n\nBest regards,\n{{companyName}}',
      variables: ['candidateName', 'interviewTime', 'companyName'],
      isActive: true,
    },
  ];

  for (const template of templates) {
    await prisma.messageTemplate.create({
      data: template,
    });
    console.log(`✅ Created template: ${template.name}`);
  }

  // 11. Create channel configs
  console.log('📡 Creating channel configurations...');
  await prisma.channelConfig.createMany({
    data: [
      {
        tenantId: tenant.id,
        channel: Channel.EMAIL,
        isActive: true,
        config: {
          provider: 'smtp',
          host: 'smtp.example.com',
          port: 587,
        },
      },
      {
        tenantId: tenant.id,
        channel: Channel.WHATSAPP,
        isActive: false,
        config: {},
      },
      {
        tenantId: tenant.id,
        channel: Channel.SMS,
        isActive: false,
        config: {},
      },
    ],
  });
  console.log('✅ Channel configurations created');

  // 12. Create usage records
  console.log('📊 Creating usage records...');
  await prisma.usageRecord.createMany({
    data: [
      {
        tenantId: tenant.id,
        metric: 'candidates_created',
        value: candidates.length,
        recordedAt: new Date(),
      },
      {
        tenantId: tenant.id,
        metric: 'interviews_scheduled',
        value: 2,
        recordedAt: new Date(),
      },
      {
        tenantId: tenant.id,
        metric: 'users_active',
        value: 3,
        recordedAt: new Date(),
      },
    ],
  });
  console.log('✅ Usage records created');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`  - Tenant: ${tenant.name}`);
  console.log(`  - Users: 3 (admin, manager, recruiter)`);
  console.log(`  - Candidates: ${candidates.length}`);
  console.log(`  - Interviews: 2`);
  console.log(`  - Teams: 1`);
  console.log(`  - Templates: ${templates.length}`);
  console.log('\n🔑 Test Credentials:');
  console.log('  Admin: admin@example.com / admin123');
  console.log('  Manager: manager@example.com / manager123');
  console.log('  Recruiter: recruiter@example.com / recruiter123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
