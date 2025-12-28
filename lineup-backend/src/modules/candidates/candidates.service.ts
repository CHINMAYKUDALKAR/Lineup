import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

/**
 * CandidatesService
 * 
 * Manages candidate operations with PrismaService integration.
 */
@Injectable()
export class CandidatesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new candidate
   */
  async create(tenantId: string, createCandidateDto: CreateCandidateDto) {
    try {
      return await this.prisma.candidate.create({
        data: {
          ...createCandidateDto,
          tenantId,
        },
      });
    } catch (error) {
      const { message, statusCode } = this.prisma.handlePrismaError(error);
      throw new Error(`${statusCode}: ${message}`);
    }
  }

  /**
   * List candidates with pagination and tenant filtering
   */
  async list(
    tenantId: string,
    page: number = 1,
    pageSize: number = 20,
    stage?: string,
  ) {
    const { skip, take } = this.prisma.paginate({ page, pageSize });

    const where = {
      ...this.prisma.withTenant(tenantId, false).where,
      ...(stage && { stage }),
    };

    const [candidates, total] = await Promise.all([
      this.prisma.findManyActive(this.prisma.candidate, {
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.candidate.count({ where }),
    ]);

    return {
      data: candidates,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Get a single candidate by ID
   */
  async findOne(tenantId: string, id: string) {
    try {
      await this.prisma.ensureTenantAccess(
        this.prisma.candidate,
        { id },
        tenantId,
      );

      return await this.prisma.candidate.findUnique({
        where: { id },
        include: {
          interviews: {
            where: { isDeleted: false },
            orderBy: { date: 'desc' },
          },
          documents: {
            where: { isDeleted: false },
          },
        },
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Record not found') {
        throw new NotFoundException('Candidate not found');
      }
      throw error;
    }
  }

  /**
   * Update a candidate
   */
  async update(
    tenantId: string,
    id: string,
    updateCandidateDto: UpdateCandidateDto,
  ) {
    try {
      await this.prisma.ensureTenantAccess(
        this.prisma.candidate,
        { id },
        tenantId,
      );

      return await this.prisma.candidate.update({
        where: { id },
        data: updateCandidateDto,
      });
    } catch (error) {
      const { message, statusCode } = this.prisma.handlePrismaError(error);
      throw new Error(`${statusCode}: ${message}`);
    }
  }

  /**
   * Soft delete a candidate
   */
  async delete(tenantId: string, id: string) {
    try {
      await this.prisma.ensureTenantAccess(
        this.prisma.candidate,
        { id },
        tenantId,
      );

      return await this.prisma.softDelete(this.prisma.candidate, { id });
    } catch (error) {
      const { message, statusCode } = this.prisma.handlePrismaError(error);
      throw new Error(`${statusCode}: ${message}`);
    }
  }

  /**
   * Bulk import candidates
   */
  async bulkImport(tenantId: string, candidatesData: CreateCandidateDto[]) {
    try {
      const data = candidatesData.map((candidate) => ({
        ...candidate,
        tenantId,
      }));

      return await this.prisma.withRetry(
        async () => {
          return this.prisma.bulkCreate(this.prisma.candidate, data);
        },
        { maxRetries: 3 },
      );
    } catch (error) {
      const { message, statusCode } = this.prisma.handlePrismaError(error);
      throw new Error(`${statusCode}: ${message}`);
    }
  }

  /**
   * Generate resume upload URL (placeholder - integrate with storage service)
   */
  async generateResumeUploadUrl(tenantId: string, candidateId: string) {
    // TODO: Integrate with storage service (S3, etc.)
    return {
      uploadUrl: `https://storage.example.com/upload/${candidateId}`,
      expiresIn: 3600,
    };
  }

  /**
   * Attach resume to candidate
   */
  async attachResume(
    tenantId: string,
    candidateId: string,
    documentData: {
      name: string;
      url: string;
      mimeType: string;
      size: number;
    },
  ) {
    try {
      await this.prisma.ensureTenantAccess(
        this.prisma.candidate,
        { id: candidateId },
        tenantId,
      );

      return await this.prisma.document.create({
        data: {
          tenantId,
          candidateId,
          type: 'RESUME',
          ...documentData,
        },
      });
    } catch (error) {
      const { message, statusCode } = this.prisma.handlePrismaError(error);
      throw new Error(`${statusCode}: ${message}`);
    }
  }
}
