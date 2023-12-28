import * as moment from 'moment';

export default class TimeUtils {
    public static readonly DATE_FORMAT = 'YYYY/MM/DD';
    public static readonly TIME_FORMAT = 'HH:mm:ss';
    public static readonly DATE_TIME_FORMAT = `${TimeUtils.DATE_FORMAT} ${TimeUtils.TIME_FORMAT}`;

    public static currentTimeMillis(): number {
        return moment().valueOf();
    }

    public static format(millis: number, format: string = TimeUtils.DATE_TIME_FORMAT): string {
        return moment(millis).format(format);
    }

    public static now(format: string = TimeUtils.DATE_TIME_FORMAT): string {
        return moment().format(format);
    }
}
