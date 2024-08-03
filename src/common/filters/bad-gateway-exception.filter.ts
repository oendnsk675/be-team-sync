import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadGatewayException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadGatewayException)
export class CustomBadGatewayExceptionFilter implements ExceptionFilter {
  catch(exception: BadGatewayException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.BAD_GATEWAY;

    const message =
      exception.message == 'Bad Gateway'
        ? "Something wen't wrong, try again!"
        : exception.message;

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
