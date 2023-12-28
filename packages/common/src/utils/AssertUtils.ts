export default class AssertUtils {
    public static isBlank(val: string): boolean {
        return !val;
    }

    public static isNotBlank(val: string): boolean {
        return !!val;
    }

    public static isNumber(val: number): boolean {
        return val !== null && val !== undefined && !isNaN(val);
    }

    public static isNotNumber(val: number): boolean {
        return !AssertUtils.isNumber(val);
    }

    public static gt(val1: number, val2: number): boolean {
        return val1 > val2;
    }

    public static ge(val1: number, val2: number): boolean {
        return val1 >= val2;
    }

    public static lt(val1: number, val2: number): boolean {
        return val1 < val2;
    }

    public static le(val1: number, val2: number): boolean {
        return val1 <= val2;
    }
}
