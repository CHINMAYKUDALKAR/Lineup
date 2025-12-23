import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global exception filter for standardized error responses
 * Catches all exceptions and formats them consistently
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = this.buildErrorResponse(exception, request, status);

        // TODO: Implement detailed error logging
        this.logError(exception, request, status);

        response.status(status).json(errorResponse);
    }

    private buildErrorResponse(exception: unknown, request: Request, status: number) {
        const baseResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
        };

        // Handle HttpException (includes our custom exceptions)
        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'object') {
                return {
                    ...baseResponse,
                    ...exceptionResponse,
                };
            }

            return {
                ...baseResponse,
                error: exception.name,
                message: exceptionResponse,
            };
        }

        // Handle unknown errors
        const message =
            exception instanceof Error ? exception.message : 'Internal server error';

        return {
            ...baseResponse,
            error: 'Internal Server Error',
            message,
            code: 'INTERNAL_ERROR',
            // TODO: Include stack trace only in development
            // Stack trace inclusion logic to be implemented
        };
    }

    private logError(exception: unknown, request: Request, status: number) {
        // TODO: Implement logging logic
        // - Extract request context (method, url, body, query, params, headers)
        // - Sanitize sensitive fields (password, token, secret, apiKey)
        // - Log with appropriate severity based on status code
        const { method, url } = request;

        if (exception instanceof Error) {
            this.logger.error(
                `${method} ${url} - ${exception.message}`,
                exception.stack,
            );
        } else {
            this.logger.error(`${method} ${url} - Unknown error`);
        }
    }

    // TODO: Implement sanitizeBody method
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private sanitizeBody(_body: any): any {
        // TODO: Implement body sanitization
        // - Clone body object
        // - Redact sensitive fields: password, token, secret, apiKey, accessToken
        throw new Error('Not implemented');
    }
}
