/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: import('@nestjs/common').ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = 'An error occurred';
    let details = null;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      message = exceptionResponse['message'] || message;
      details = exceptionResponse['details'] || null;
    }

    response.status(status).json({
      status: 'Error',
      message,
      error: {
        code: status,
        type: exceptionResponse['error'] || 'Internal Server Error',
        details: details,
      },
    });
  }
}
