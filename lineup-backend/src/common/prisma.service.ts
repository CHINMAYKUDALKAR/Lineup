import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface PaginationResult {
  skip: number;
  take: number;
}

export interface SoftDeleteOptions {
  deletedAt?: Date;
}

export interface TenantQueryOptions {
  tenantId: string;
  includeDeleted?: boolean;
}

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
}

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  latency?: number;
  error?: string;
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });

    // Log queries in development
    if (
      typeof process !== 'undefined' &&
      process.env.NODE_ENV !== 'production'
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).$on('query', (e: Prisma.QueryEvent) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Params: ${e.params}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }
  }

  async onModuleInit() {
    try {
    await this.$connect();
      this.logger.log('✅ Prisma connected to database');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('✅ Prisma disconnected from database');
    } catch (error) {
      this.logger.error('❌ Error during Prisma disconnect', error);
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    // Prisma 5.0.0+ uses library engine, so we use process events instead
    const shutdown = async (signal: string) => {
      this.logger.log(`Received ${signal}, closing application...`);
      try {
        await this.$disconnect();
      await app.close();
        process.exit(0);
      } catch (error) {
        this.logger.error(`Error during shutdown: ${error}`);
        process.exit(1);
      }
    };

    process.on('beforeExit', () => shutdown('beforeExit'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }

  /**
   * Pagination helper to calculate skip and take values
   * @param options - Pagination options with page (1-based) and pageSize
   * @returns Object with skip and take values for Prisma queries
   */
  paginate(options: PaginationOptions): PaginationResult {
    const { page, pageSize } = options;
    const skip = page > 0 ? (page - 1) * pageSize : 0;
    const take = pageSize > 0 ? pageSize : 10;

    return { skip, take };
  }

  /**
   * Centralized Prisma error handler
   * Converts Prisma errors to user-friendly messages
   * @param error - Prisma error or unknown error
   * @returns Formatted error message and status code
   */
  handlePrismaError(error: unknown): {
    message: string;
    statusCode: number;
    code?: string;
  } {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return {
            message: 'A record with this value already exists',
            statusCode: 409,
            code: error.code,
          };
        case 'P2025':
          return {
            message: 'Record not found',
            statusCode: 404,
            code: error.code,
          };
        case 'P2003':
          return {
            message: 'Foreign key constraint failed',
            statusCode: 400,
            code: error.code,
          };
        case 'P2014':
          return {
            message: 'Invalid relation operation',
            statusCode: 400,
            code: error.code,
          };
        case 'P2015':
          return {
            message: 'Related record not found',
            statusCode: 404,
            code: error.code,
          };
        case 'P2016':
          return {
            message: 'Query interpretation error',
            statusCode: 400,
            code: error.code,
          };
        case 'P2017':
          return {
            message: 'Records for relation not connected',
            statusCode: 400,
            code: error.code,
          };
        case 'P2018':
          return {
            message: 'Required connected records not found',
            statusCode: 404,
            code: error.code,
          };
        case 'P2019':
          return {
            message: 'Input error',
            statusCode: 400,
            code: error.code,
          };
        case 'P2020':
          return {
            message: 'Value out of range',
            statusCode: 400,
            code: error.code,
          };
        case 'P2021':
          return {
            message: 'Table does not exist',
            statusCode: 500,
            code: error.code,
          };
        case 'P2022':
          return {
            message: 'Column does not exist',
            statusCode: 500,
            code: error.code,
          };
        case 'P2023':
          return {
            message: 'Inconsistent column data',
            statusCode: 500,
            code: error.code,
          };
        case 'P2024':
          return {
            message: 'Connection timeout',
            statusCode: 503,
            code: error.code,
          };
        case 'P2026':
          return {
            message: 'Unsupported feature',
            statusCode: 501,
            code: error.code,
          };
        case 'P2027':
          return {
            message: 'Multiple errors occurred',
            statusCode: 400,
            code: error.code,
          };
        default:
          return {
            message: `Database error: ${error.message}`,
            statusCode: 500,
            code: error.code,
          };
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return {
        message: 'Validation error: Invalid input data',
        statusCode: 400,
      };
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return {
        message: 'Database connection error',
        statusCode: 503,
      };
    }

    if (error instanceof Prisma.PrismaClientRustPanicError) {
      return {
        message: 'Database engine error',
        statusCode: 500,
      };
    }

    // Unknown error
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      message: errorMessage,
      statusCode: 500,
    };
  }

  /**
   * Execute a function within a database transaction
   * @param callback - Function to execute within transaction
   * @param options - Transaction options (isolation level, timeout)
   * @returns Result of the callback function
   */
  async $transaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): Promise<T> {
    try {
      return await super.$transaction(callback, options);
    } catch (error) {
      this.logger.error('Transaction failed', error);
      throw error;
    }
  }

  /**
   * Soft delete helper - marks a record as deleted
   * @param model - Prisma model delegate (e.g., this.candidate)
   * @param where - Where clause to find the record
   * @param options - Soft delete options
   * @returns Updated record
   */
  async softDelete<T extends { isDeleted: boolean; deletedAt: Date | null }>(
    model: {
      update: (args: {
        where: any;
        data: { isDeleted: boolean; deletedAt: Date | null };
      }) => Promise<T>;
    },
    where: any,
    options: SoftDeleteOptions = {},
  ): Promise<T> {
    return model.update({
      where,
      data: {
        isDeleted: true,
        deletedAt: options.deletedAt || new Date(),
      },
    });
  }

  /**
   * Restore a soft-deleted record
   * @param model - Prisma model delegate
   * @param where - Where clause to find the record
   * @returns Restored record
   */
  async restore<T extends { isDeleted: boolean; deletedAt: Date | null }>(
    model: {
      update: (args: {
        where: any;
        data: { isDeleted: boolean; deletedAt: Date | null };
      }) => Promise<T>;
    },
    where: any,
  ): Promise<T> {
    return model.update({
      where,
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });
  }

  /**
   * Find many records excluding soft-deleted ones
   * @param model - Prisma model delegate
   * @param args - Prisma findMany arguments
   * @returns Array of non-deleted records
   */
  async findManyActive<T extends { isDeleted: boolean }>(
    model: {
      findMany: (args: any) => Promise<T[]>;
    },
    args: any = {},
  ): Promise<T[]> {
    return model.findMany({
      ...args,
      where: {
        ...args.where,
        isDeleted: false,
      },
    });
  }

  /**
   * Find many records including soft-deleted ones
   * @param model - Prisma model delegate
   * @param args - Prisma findMany arguments
   * @returns Array of all records (including deleted)
   */
  async findManyWithDeleted<T extends { isDeleted: boolean }>(
    model: {
      findMany: (args: any) => Promise<T[]>;
    },
    args: any = {},
  ): Promise<T[]> {
    // Remove isDeleted filter if present
    const { where, ...rest } = args;
    const { isDeleted, ...whereRest } = where || {};
    return model.findMany({
      ...rest,
      where: whereRest,
    });
  }

  /**
   * Tenant-scoped query helper
   * Automatically adds tenantId filter to queries
   * @param tenantId - Tenant ID to filter by
   * @param includeDeleted - Whether to include soft-deleted records
   * @returns Query builder with tenant filter applied
   */
  withTenant<T extends { tenantId: string; isDeleted?: boolean }>(
    tenantId: string,
    includeDeleted = false,
  ) {
    return {
      where: {
        tenantId,
        ...(includeDeleted ? {} : { isDeleted: false }),
      },
    };
  }

  /**
   * Ensure a record belongs to a specific tenant
   * Throws error if tenant mismatch
   * @param model - Prisma model delegate
   * @param where - Where clause including id
   * @param tenantId - Expected tenant ID
   * @returns Record if tenant matches
   * @throws Error if tenant doesn't match or record not found
   */
  async ensureTenantAccess<T extends { tenantId: string }>(
    model: {
      findUnique: (args: { where: any }) => Promise<T | null>;
    },
    where: { id: string },
    tenantId: string,
  ): Promise<T> {
    const record = await model.findUnique({ where });
    if (!record) {
      throw new Error('Record not found');
    }
    if (record.tenantId !== tenantId) {
      throw new Error('Access denied: Record belongs to different tenant');
    }
    return record;
  }

  /**
   * Check database connection health
   * @returns Health check result with status and latency
   */
  async checkHealth(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    try {
      await this.$queryRaw`SELECT 1`;
      const latency = Date.now() - startTime;
      return {
        status: 'healthy',
        latency,
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      return {
        status: 'unhealthy',
        latency,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Execute a function with retry logic for transient failures
   * @param fn - Function to execute
   * @param options - Retry options
   * @returns Result of the function
   */
  async withRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {},
  ): Promise<T> {
    const maxRetries = options.maxRetries || 3;
    const retryDelay = options.retryDelay || 1000;

    let lastError: unknown;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // Check if error is retryable
        const isRetryable =
          error instanceof Prisma.PrismaClientInitializationError ||
          (error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2024'); // Connection timeout

        if (!isRetryable || attempt === maxRetries) {
          throw error;
        }

        this.logger.warn(
          `Retry attempt ${attempt + 1}/${maxRetries} after error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    throw lastError;
  }

  /**
   * Bulk create records
   * @param model - Prisma model delegate
   * @param data - Array of data objects
   * @param batchSize - Number of records per batch (default: 1000)
   * @returns Created records
   */
  async bulkCreate<T>(
    model: {
      createMany: (args: { data: any[]; skipDuplicates?: boolean }) => Promise<{ count: number }>;
    },
    data: any[],
    batchSize = 1000,
  ): Promise<{ count: number }> {
    const results = [];
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const result = await model.createMany({
        data: batch,
        skipDuplicates: true,
      });
      results.push(result);
    }
    return {
      count: results.reduce((sum, r) => sum + r.count, 0),
    };
  }

  /**
   * Bulk update records
   * Note: Prisma doesn't support bulk update directly, so this uses transactions
   * @param updateFn - Function that takes transaction client and performs updates
   * @param batchSize - Number of updates per batch (default: 100)
   * @returns Number of updated records
   */
  async bulkUpdate<T>(
    updateFn: (tx: Prisma.TransactionClient) => Promise<T[]>,
    batchSize = 100,
  ): Promise<number> {
    let updatedCount = 0;
    await this.$transaction(async (tx) => {
      const results = await updateFn(tx);
      updatedCount = results.length;
    });
    return updatedCount;
  }

  /**
   * Get connection pool information
   * @returns Connection pool stats (if available)
   */
  getConnectionInfo(): {
    connected: boolean;
    engine: string;
  } {
    return {
      connected: true, // Prisma manages connection internally
      engine: 'library', // Prisma 5.0+ uses library engine
    };
  }
}
