import { HttpException } from '@nestjs/common';

export class ErrorHelper {
  static throwHttpError(message: string, code: number) {
    throw new HttpException(message, code);
  }
}
