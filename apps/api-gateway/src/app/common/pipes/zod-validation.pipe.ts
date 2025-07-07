import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      this.schema.parse(value);
    } catch (error: ZodError | unknown) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));
        throw new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors,
        });
      }
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}
