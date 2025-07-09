import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.BAD_REQUEST;

    // Create a clean, structured error response
    const formattedErrors = exception.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
        code: issue.code,
        soem: issue.fatal ? 'fatal' : 'non-fatal',
    }));

    response.status(status).json({
      statusCode: status,
      message: 'Input validation failed',
      errors: formattedErrors,
    });
  }
}