import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';

/**
 * InterviewsService
 * 
 * Manages interview operations with PrismaService integration.
 */
@Injectable()
export class InterviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new interview
   */
  async create(tenantId: string, createInterviewDto: CreateInterviewDto) {
    try {
      // Verify candidate belongs to tenant
      await this.prisma.ensureTenantAccess(
        this.prisma.candidate,
        { id: createInterviewDto.candidateId },
        tenantId,
      );

      return await this.prisma.executeTransaction(async (tx) => {
        const interview = await tx.interview.create({
          data: {
            tenantId,
            candidateId: createInterviewDto.candidateId,
            date: new Date(createInterviewDto.startAt),
            durationMins: createInterviewDto.durationMins,
            title: createInterviewDto.stage,
            location: createInterviewDto.location,
            meetingLink: createInterviewDto.meetingLink,
            description: createInterviewDto.notes,
            status: 'SCHEDULED',
          },
        });

        // Add interviewers (required in DTO)
        if (createInterviewDto.interviewerIds?.length) {
          await tx.interviewInterviewer.createMany({
            data: createInterviewDto.interviewerIds.map((userId) => ({
              interviewId: interview.id,
              userId,
            })),
          });
        }

        return tx.interview.findUnique({
          where: { id: interview.id },
          include: {
            candidate: true,
            interviewers: {
              include: { user: true },
            },
          },
        });
      });
    } catch (error) {
      const { message, statusCode } = this.prisma.handlePrismaError(error);
      throw new Error(`${statusCode}: ${message}`);
    }
  }

  /**
   * List interviews with pagination
   */
  async list(
    tenantId: string,
    page: number = 1,
    pageSize: number = 20,
    candidateId?: string,
    status?: string,
  ) {
    const { skip, take } = this.prisma.paginate({ page, pageSize });

    const where = {
      ...this.prisma.withTenant(tenantId, false).where,
      ...(candidateId && { candidateId }),
      ...(status && { status }),
    };

    const [interviews, total] = await Promise.all([
      this.prisma.findManyActive(this.prisma.interview, {
        where,
        skip,
        take,
        orderBy: { date: 'asc' },
        include: {
          candidate: true,
          interviewers: {
            include: { user: true },
          },
        },
      }),
      this.prisma.interview.count({ where }),
    ]);

    return {
      data: interviews,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Get a single interview by ID
   */
  async findOne(tenantId: string, id: string) {
    try {
      await this.prisma.ensureTenantAccess(
        this.prisma.interview,
        { id },
        tenantId,
      );

      return await this.prisma.interview.findUnique({
        where: { id },
        include: {
          candidate: true,
          interviewers: {
            include: { user: true },
          },
          feedbacks: {
            where: { isDeleted: false },
            include: { user: true },
          },
        },
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Record not found') {
        throw new NotFoundException('Interview not found');
      }
      throw error;
    }
  }

  /**
   * Reschedule an interview
   */
  async reschedule(
    tenantId: string,
    id: string,
    newDate: Date,
    newDurationMins?: number,
  ) {
    try {
      await this.prisma.ensureTenantAccess(
        this.prisma.interview,
        { id },
        tenantId,
      );

      // Check for conflicts
      const conflicts = await this.checkConflicts(
        tenantId,
        newDate,
        newDurationMins || 60,
        id, // Exclude current interview
      );

      if (conflicts.length > 0) {
        throw new BadRequestException('Time slot conflicts with existing interviews');
      }

      return await this.prisma.interview.update({
        where: { id },
        data: {
          date: newDate,
          ...(newDurationMins && { durationMins: newDurationMins }),
          status: 'RESCHEDULED',
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      const { message, statusCode } = this.prisma.handlePrismaError(error);
      throw new Error(`${statusCode}: ${message}`);
    }
  }

  /**
   * Check for scheduling conflicts
   */
  async checkConflicts(
    tenantId: string,
    date: Date,
    durationMins: number,
    excludeInterviewId?: string,
  ) {
    const endTime = new Date(date.getTime() + durationMins * 60 * 1000);

    const where: any = {
      ...this.prisma.withTenant(tenantId, false).where,
      status: {
        in: ['SCHEDULED', 'CONFIRMED'],
      },
      OR: [
        {
          date: { gte: date, lt: endTime },
        },
        {
          AND: [
            { date: { lte: date } },
            {
              date: {
                gte: new Date(
                  date.getTime() -
                    (await this.prisma.interview.findFirst({
                      where: { id: excludeInterviewId || '' },
                      select: { durationMins: true },
                    }))?.durationMins ||
                    60 * 60 * 1000,
                ),
              },
            },
          ],
        },
      ],
      ...(excludeInterviewId && { id: { not: excludeInterviewId } }),
    };

    return this.prisma.interview.findMany({ where });
  }

  /**
   * Detect conflicts for a time range
   */
  async detectConflicts(
    tenantId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return this.prisma.interview.findMany({
      where: {
        ...this.prisma.withTenant(tenantId, false).where,
        status: {
          in: ['SCHEDULED', 'CONFIRMED'],
        },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        candidate: true,
        interviewers: {
          include: { user: true },
        },
      },
    });
  }

  /**
   * Check if candidate has active interview
   */
  async checkCandidateHasActiveInterview(
    tenantId: string,
    candidateId: string,
  ) {
    const activeInterview = await this.prisma.interview.findFirst({
      where: {
        tenantId,
        candidateId,
        status: {
          in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'],
        },
        isDeleted: false,
      },
    });

    return !!activeInterview;
  }

  /**
   * Cancel an interview
   */
  async cancel(tenantId: string, id: string) {
    try {
      await this.prisma.ensureTenantAccess(
        this.prisma.interview,
        { id },
        tenantId,
      );

      return await this.prisma.interview.update({
        where: { id },
        data: {
          status: 'CANCELLED',
        },
      });
    } catch (error) {
      const { message, statusCode } = this.prisma.handlePrismaError(error);
      throw new Error(`${statusCode}: ${message}`);
    }
  }

  /**
   * Complete an interview
   */
  async complete(tenantId: string, id: string) {
    try {
      await this.prisma.ensureTenantAccess(
        this.prisma.interview,
        { id },
        tenantId,
      );

      return await this.prisma.interview.update({
        where: { id },
        data: {
          status: 'COMPLETED',
        },
      });
    } catch (error) {
      const { message, statusCode } = this.prisma.handlePrismaError(error);
      throw new Error(`${statusCode}: ${message}`);
    }
  }

  /**
   * Delete an interview (soft delete)
   */
  async delete(tenantId: string, id: string) {
    try {
      await this.prisma.ensureTenantAccess(
        this.prisma.interview,
        { id },
        tenantId,
      );

      return await this.prisma.softDelete(this.prisma.interview, { id });
    } catch (error) {
      const { message, statusCode } = this.prisma.handlePrismaError(error);
      throw new Error(`${statusCode}: ${message}`);
    }
  }

  /**
   * Bulk schedule interviews
   */
  async bulkSchedule(
    tenantId: string,
    candidateIds: string[],
    interviewerIds: string[],
    startTime: Date,
    durationMins: number,
    bulkMode: 'SEQUENTIAL' | 'GROUP',
    stage?: string,
  ) {
    try {
      return await this.prisma.executeTransaction(async (tx) => {
        const results = [];
        let currentTime = new Date(startTime);

        for (const candidateId of candidateIds) {
          // Verify candidate
          try {
            await this.prisma.ensureTenantAccess(
              this.prisma.candidate,
              { id: candidateId },
              tenantId,
            );

            const interview = await tx.interview.create({
              data: {
                tenantId,
                candidateId,
                date: bulkMode === 'GROUP' ? startTime : currentTime,
                durationMins,
                title: stage,
                status: 'SCHEDULED',
              },
            });

            if (interviewerIds.length) {
              await tx.interviewInterviewer.createMany({
                data: interviewerIds.map((userId) => ({
                  interviewId: interview.id,
                  userId,
                })),
              });
            }

            results.push({
              candidateId,
              interviewId: interview.id,
              scheduledAt: interview.date.toISOString(),
            });

            // For SEQUENTIAL mode, offset next interview by duration
            if (bulkMode === 'SEQUENTIAL') {
              currentTime = new Date(
                currentTime.getTime() + durationMins * 60 * 1000,
              );
            }
          } catch (error) {
            // Skip candidate if access denied or not found
            continue;
          }
        }

        return {
          total: candidateIds.length,
          scheduled: results.length,
          skipped: candidateIds.length - results.length,
          bulkBatchId: `batch-${Date.now()}`,
          bulkMode,
          created: results,
          skippedCandidates: candidateIds
            .filter(
              (id) => !results.some((r) => r.candidateId === id),
            )
            .map((id) => ({
              candidateId: id,
              reason: 'Access denied or candidate not found',
            })),
        };
      });
    } catch (error) {
      const { message, statusCode } = this.prisma.handlePrismaError(error);
      throw new Error(`${statusCode}: ${message}`);
    }
  }
}
