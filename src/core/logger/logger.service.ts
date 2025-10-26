import { Logger } from '@nestjs/common';

export class LoggerUtils {
  static logger = new Logger();

  static log(context: string, message: any) {
    this.logger.log(message, context);
  }

  static dividerLog(message: string) {
    this.logger.debug(
      `=================================${message}=================================`,
    );
  }

  static debug(context: string, message: any) {
    this.logger.debug(
      `================================= Start ${context} =================================`,
    );
    this.logger.debug(this.format(message), context);
    this.logger.debug(
      `================================= End ${context} =================================`,
    );
  }

  static logQuery(context: string, message: any) {
    this.logger.warn(
      `================================= Start ${context} =================================`,
    );
    this.logger.warn(this.format(message), context);
    this.logger.warn(
      `================================= End ${context} =================================`,
    );
  }

  static verbose(context: string, message: any) {
    this.logger.verbose(this.format(message), context);
  }

  static warn(context: string, message: any) {
    this.logger.warn(this.format(message), context);
  }

  static error(context: string, errorStack: any, message?: any) {
    this.logger.error(this.format(message), errorStack, context);
  }

  static format(message: any) {
    return typeof message === 'object'
      ? JSON.stringify(message, null, 2)
      : message;
  }
}
