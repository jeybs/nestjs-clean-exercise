import moment from 'moment-timezone';
import { format } from 'date-fns';

export class DateTimeHelper {
  static epochToFormattedDate(epoch: number): string {
    return format(new Date(epoch), 'yyyy-MM-dd HH:mm:ss');
  }

  static getUtcDateTime() {
    // return moment().utc().format('YYYY-MM-DD HH:mm:ss');
    return moment.utc().toDate();
  }

  static convertUtcToLocalTime(
    utcDate: string,
    format: string = 'MM DD, YYYY hh:mm a',
  ): string {
    const localTime = moment(utcDate).add(8, 'hours').format(format);

    return localTime;
  }

  static convertLocalDateTimeToUtc(localDateTime: string): string {
    const utcDateTime = moment(localDateTime, 'YYYY-MM-DD HH:mm:ss')
      .subtract(8, 'hours')
      .format('YYYY-MM-DD HH:mm:ss');

    return utcDateTime;
  }

  static addToDate(amount: number, unit: moment.DurationInputArg2 = 'minutes') {
    return moment(this.getUtcDateTime())
      .add(amount, unit)
      .format('YYYY-MM-DD HH:mm:ss');
  }

  static convertSecondsToMinutes(valueInSeconds) {
    return Math.trunc(valueInSeconds / 60);
  }
}
