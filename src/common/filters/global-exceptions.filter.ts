import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpExceptionBody,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';

type ExceptionResponse = {
  message: string[];
  error: string;
  statusCode: number;
};

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(GlobalExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const response = host.switchToHttp().getResponse<Response>();
    const isHttpException = exception instanceof HttpException;

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let messages: string[] = ['Internal Server Error'];
    let errorName = 'Internal Server Error';

    if (isHttpException) {
      const responseData = exception.getResponse();

      if (typeof responseData === 'string') {
        messages = [responseData];
      }

      if (typeof responseData === 'object' && responseData !== null) {
        const { message, error } = responseData as HttpExceptionBody;

        if (Array.isArray(message)) {
          messages = message;
        }

        if (typeof message === 'string') {
          messages = [message];
        }

        if (typeof error === 'string') {
          errorName = error;
        }
      }
    }

    if (!(exception instanceof HttpException)) {
      this.logger.error(
        'Unexpected error',
        (exception as Error).stack || 'no stack',
      );
    } else {
      this.logger.warn(`${httpStatus} - ${errorName}: ${messages.join(' | ')}`);
    }

    const responseBody: ExceptionResponse = {
      message: messages,
      error: errorName,
      statusCode: httpStatus,
    };

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
