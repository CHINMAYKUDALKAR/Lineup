import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, UserStatus } from '@prisma/client';
import * as crypto from 'crypto';

/**
 * UsersService
 * 
 * Manages user operations with PrismaService integration.
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Invite a user to the tenant
   */
  async inviteUser(
    tenantId: string,
    email: string,
    role: Role,
    invitedBy: string,
  ) {
    try {
      // Check if user already exists in tenant
      const existingUser = await this.prisma.user.findUnique({
        where: {
          tenantId_email: {
            tenantId,
            email,
          },
        },
      });

      if (existingUser) {
        throw new BadRequestException('User already exists in this tenant');
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      return await this.prisma.invitation.create({
        data: {
          tenantId,
          email,
          role,
          invitedBy,
          token,
          expiresAt,
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      const { message, statusCode } = this.prisma.handlePrismaError(error);
      throw new Error(`${statusCode}: ${message}`);
    }
  }

  /**
   * Accept invitation and create user
   */
  async acceptInvite(token: string, password: string, name?: string) {
    try {
      const invitation = await this.prisma.invitation.findUnique({
        where: { token },
        include: { tenant: true },
      });

      if (!invitation) {
        throw new NotFoundException('Invalid invitation token');
      }

      if (invitation.expiresAt < new Date()) {
        throw new BadRequestException('Invitation has expired');
      }

      if (invitation.acceptedAt) {
        throw new BadRequestException('Invitation already accepted');
      }

      // Create user
      const user = await this.prisma.executeTransaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            tenantId: invitation.tenantId,
            email: invitation.email,
            password, // Should be hashed before this point
            name: name || invitation.email.split('@')[0],
            role: invitation.role,
            status: UserStatus.ACTIVE,
            emailVerified: true,
            emailVerifiedAt: new Date(),
            activeTenantId: invitation.tenantId,
          },
        });

        // Mark invitation as accepted
        await tx.invitation.update({
          where: { id: invitation.id },
          data: { acceptedAt: new Date() },
        });

        return newUser;
      });

      return user;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const { message, statusCode } = this.prisma.handlePrismaError(error);
      throw new Error(`${statusCode}: ${message}`);
    }
  }

  /**
   * List users in a tenant
   */
  async listUsers(
    tenantId: string,
    page: number = 1,
    pageSize: number = 20,
    role?: Role,
    status?: UserStatus,
  ) {
    const { skip, take } = this.prisma.paginate({ page, pageSize });

    const where = {
      ...this.prisma.withTenant(tenantId, false).where,
      ...(role && { role }),
      ...(status && { status }),
    };

    const [users, total] = await Promise.all([
      this.prisma.findManyActive(this.prisma.user, {
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          emailVerified: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          // Exclude password
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Get a single user by ID
   */
  async findOne(tenantId: string, id: string) {
    try {
      await this.prisma.ensureTenantAccess(
        this.prisma.user,
        { id },
        tenantId,
      );

      return await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          avatarUrl: true,
          role: true,
          status: true,
          emailVerified: true,
          twoFactorEnabled: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          teams: {
            include: { team: true },
          },
          customRoles: {
            include: { role: true },
          },
          // Exclude password
        },
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Record not found') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  /**
   * Update a user
   */
  async update(tenantId: string, id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.prisma.ensureTenantAccess(
        this.prisma.user,
        { id },
        tenantId,
      );

      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          avatarUrl: true,
          role: true,
          status: true,
          updatedAt: true,
          // Exclude password
        },
      });
    } catch (error) {
      const { message, statusCode } = this.prisma.handlePrismaError(error);
      throw new Error(`${statusCode}: ${message}`);
    }
  }

  /**
   * Activate a user
   */
  async activateUser(tenantId: string, id: string) {
    try {
      await this.prisma.ensureTenantAccess(
        this.prisma.user,
        { id },
        tenantId,
      );

      return await this.prisma.user.update({
        where: { id },
        data: {
          status: UserStatus.ACTIVE,
        },
      });
    } catch (error) {
      const { message, statusCode } = this.prisma.handlePrismaError(error);
      throw new Error(`${statusCode}: ${message}`);
    }
  }

  /**
   * Deactivate a user
   */
  async deactivateUser(tenantId: string, id: string) {
    try {
      await this.prisma.ensureTenantAccess(
        this.prisma.user,
        { id },
        tenantId,
      );

      return await this.prisma.user.update({
        where: { id },
        data: {
          status: UserStatus.INACTIVE,
        },
      });
    } catch (error) {
      const { message, statusCode } = this.prisma.handlePrismaError(error);
      throw new Error(`${statusCode}: ${message}`);
    }
  }
}
