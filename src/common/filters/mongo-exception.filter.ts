import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Response } from 'express';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.code === 11000) {
      // Handle duplicate key error
      const keyValue = (exception as any).keyValue;
      const field = Object.keys(keyValue)[0];
      
      let message = 'Dữ liệu đã tồn tại trong hệ thống';
      
      // Specific message for phone number
      if (field === 'phone') {
        message = 'Số điện thoại này đã được đăng ký trong hệ thống';
      }

      response.status(409).json({
        statusCode: 409,
        message: message,
        error: 'Conflict',
      });
    } else {
      // Handle other MongoDB errors
      response.status(500).json({
        statusCode: 500,
        message: 'Đã có lỗi xảy ra',
        error: 'Internal Server Error',
      });
    }
  }
} 